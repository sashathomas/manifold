import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { entityEditorActions, entityStoreActions } from "actions";
import GlobalForm from "global/components/form";
import Developer from "global/components/developer";
import { bindActionCreators } from "redux";
import get from "lodash/get";
import has from "lodash/has";
import forEach from "lodash/forEach";
import isFunction from "lodash/isFunction";
import pick from "lodash/pick";
import brackets2dots from "brackets2dots";
import { Prompt } from "react-router-dom";
import { FormContext } from "helpers/contexts";
import isArray from "lodash/isArray";

const { request, flush } = entityStoreActions;
const { close, open, set, refresh } = entityEditorActions;

export class FormContainer extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    return {
      session: get(state.entityEditor.sessions, ownProps.name),
      response: get(state.entityStore.responses, ownProps.name),
      errors: get(state.entityStore.responses, `${ownProps.name}.errors`)
    };
  };

  static displayName = "Form.Form";

  static propTypes = {
    doNotWarn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.array,
      PropTypes.element
    ]),
    model: PropTypes.object,
    update: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    debug: PropTypes.bool,
    groupErrors: PropTypes.bool,
    groupErrorsStyle: PropTypes.object,
    session: PropTypes.object,
    errors: PropTypes.array,
    response: PropTypes.object,
    className: PropTypes.string,
    options: PropTypes.object,
    flushOnUnmount: PropTypes.bool,
    notificationScope: PropTypes.string
  };

  static defaultProps = {
    doNotWarn: false,
    notificationScope: "global",
    model: {
      attributes: {},
      relationships: {}
    },
    debug: false,
    groupErrors: false,
    flushOnUnmount: true,
    modelName: "This model",
    options: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      preventDirtyWarning: false,
      submitKey: null
    };
  }

  componentDidMount() {
    this.maybeOpenSession(this.props);
  }

  componentDidUpdate(prevProps, prevStateIgnored) {
    this.maybeOpenSession(this.props, prevProps);
  }

  componentWillUnmount() {
    this.closeSession(this.props);
    this.flushSave(this.props);
  }

  closeSession(props) {
    props.dispatch(close(props.name));
  }

  flushSave(props) {
    if (props.flushOnUnmount) props.dispatch(flush(props.name));
  }

  maybeOpenSession(props, prevProps = {}) {
    const model = props.model || {};

    if (prevProps.model !== props.model) {
      if (
        prevProps.model &&
        props.model &&
        prevProps.model.id === props.model.id
      ) {
        return this.refreshSession(props.name, model);
      } else {
        return this.openSession(props.name, model);
      }
    }
    if (props.session) return null;
    this.openSession(props.name, model);
  }

  refreshSession(name, model = {}) {
    this.props.dispatch(refresh(name, model));
  }

  openSession(name, model = {}) {
    this.props.dispatch(open(name, model));
  }

  handleSubmit = (event = null) => {
    if (event) event.preventDefault();
    this.setState({ submitKey: this.createKey() });
    if (this.props.session.source.id) {
      this.update();
    } else {
      this.create();
    }
  };

  createKey() {
    const keyLength = 6;
    return Math.random()
      .toString(36)
      .substr(2, keyLength);
  }

  adjustedRelationships(relationships) {
    if (!relationships) return {};
    const adjusted = { ...relationships };
    forEach(adjusted, (value, key) => {
      const adjustedValue = isArray(value)
        ? value.map(relation => pick(relation, ["id", "type"]))
        : pick(value, ["id", "type"]);

      adjusted[key] = {
        data: adjustedValue
      };
    });

    return adjusted;
  }

  update() {
    const dirty = this.props.session.dirty;
    const source = this.props.session.source;
    const call = this.props.update(source.id, {
      attributes: dirty.attributes,
      relationships: this.adjustedRelationships(dirty.relationships)
    });
    const action = request(call, this.props.name, this.requestOptions());
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty("promise") && this.props.onSuccess) {
      res.promise.then(() => {
        this.setState({ preventDirtyWarning: true }, () => {
          this.props.onSuccess(this.props.response.entity);
        });
      });
    }
  }

  requestOptions() {
    return {
      ...this.props.options,
      notificationScope: this.props.notificationScope
    };
  }

  create() {
    const { dirty, source } = this.props.session;
    const call = this.props.create({
      attributes: { ...source.attributes, ...dirty.attributes },
      relationships: this.adjustedRelationships(dirty.relationships)
    });
    const action = request(call, this.props.name, this.requestOptions());
    const res = this.props.dispatch(action);
    if (res.hasOwnProperty("promise") && this.props.onSuccess) {
      res.promise.then(() => {
        this.setState({ preventDirtyWarning: true }, () => {
          this.props.onSuccess(this.props.response.entity);
        });
      });
    }
  }

  nameToPath(name) {
    return brackets2dots(name);
  }

  lookupValue(name, props) {
    const path = this.nameToPath(name);
    if (has(props.session.dirty, path)) {
      return get(props.session.dirty, path);
    }
    if (has(props.session.source, path)) {
      return get(props.session.source, path);
    }
    return null;
  }

  contextProps = props => {
    const out = {
      actions: {
        set: bindActionCreators(set, props.dispatch)
      },
      dirtyModel: props.session.dirty,
      sourceModel: props.session.source,
      getModelValue: name => this.lookupValue(name, this.props),
      sessionKey: props.name,
      submitKey: this.state.submitKey
    };
    if (!this.props.groupErrors) out.errors = props.errors || [];
    return out;
  };

  isBlocking() {
    if (this.props.doNotWarn === true) return false;
    if (this.state.preventDirtyWarning === true) return false;
    if (this.props.session.changed === true) return true;
    return false;
  }

  renderGroupedErrors(props) {
    if (!props.groupErrors || !props.errors) return null;
    return (
      <GlobalForm.Errorable
        containerStyle={props.groupErrorsStyle}
        className="form-input form-error-grouped"
        name="*"
        errors={props.errors}
      />
    );
  }

  renderModelErrors(props) {
    if (props.groupErrors || !props.errors) return null;
    return (
      <GlobalForm.Errorable
        name="attributes[base]"
        errors={props.errors}
        nameForError={props.modelName}
      />
    );
  }

  renderDebugger() {
    if (!this.props.debug) return null;
    const debug = {
      session: this.props.session,
      errors: this.props.errors
    };
    return <Developer.Debugger object={debug} />;
  }

  render() {
    if (!this.props.session) return null;

    const contextProps = this.contextProps(this.props);

    return (
      <div>
        {this.renderDebugger()}

        <Prompt
          when={this.isBlocking()}
          message="You may have unsaved changes. Do you want to leave without saving your changes?"
        />

        {this.renderGroupedErrors(this.props)}
        <form
          onSubmit={this.handleSubmit}
          className={this.props.className}
          data-id="submit"
        >
          <FormContext.Provider value={contextProps}>
            {isFunction(this.props.children)
              ? this.props.children(contextProps.getModelValue)
              : this.props.children}
          </FormContext.Provider>
        </form>
        {this.renderModelErrors(this.props)}
      </div>
    );
  }
}

export default connectAndFetch(FormContainer);
