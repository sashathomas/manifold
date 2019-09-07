import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "./parts/Button";
import Panel from "./parts/Panel";
import ReadingGroupOption from "./parts/ReadingGroupOption";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export default class AnnotationPopupSecondaryReadingGroup extends PureComponent {
  static displayName = "Annotation.Popup.Secondary.ReadingGroup";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    readingGroups: PropTypes.array,
    currentReadingGroup: PropTypes.string.isRequired
  };

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  get hasReadingGroups() {
    return this.readingGroups && this.readingGroups.length > 0;
  }

  isSelected(id) {
    return id === this.props.currentReadingGroup;
  }

  renderBackButton() {
    return (
      <Button
        key="back"
        onClick={this.props.onBackClick}
        kind="any"
        label="Back"
        className="annotation-popup__button--secondary-dark"
        icon="arrowLeft32"
      />
    );
  }

  renderHeader() {
    return (
      <div className="annotation-popup__header">
        <IconComposer icon="readingGroup24" size="default" />
        <span className="annotation-popup__heading">Reading Groups:</span>
      </div>
    );
  }

  renderOptions() {
    const { onSelect, currentReadingGroup } = this.props;
    return (
      <ul className="annotation-group-options__list">
        <ReadingGroupOption
          label={this.publicLabel}
          onClick={() => onSelect("public")}
          selected={currentReadingGroup === "public"}
        />
        <ReadingGroupOption
          label={this.privateLabel}
          onClick={() => onSelect("private")}
          privateGroup
          selected={currentReadingGroup === "private"}
        />
        {this.hasReadingGroups &&
          this.readingGroups.map(rg => (
            <ReadingGroupOption
              key={rg.id}
              label={rg.attributes.name}
              onClick={() => onSelect(rg.id)}
              privateGroup={rg.attributes.privacy === "private"}
              selected={currentReadingGroup === rg.id}
            />
          ))}
      </ul>
    );
  }

  renderFooter() {
    return (
      <div className="annotation-group-options__footer">
        <Link
          to={lh.link("frontendReadingGroups")}
          className="annotation-group-options__link"
        >
          <span className="annotation-group-options__link-text">
            Manage Groups
          </span>
          <IconComposer
            icon="link24"
            size="default"
            iconClass="annotation-group-options__icon annotation-group-options__icon--link"
          />
        </Link>
      </div>
    );
  }

  render() {
    return (
      <Panel
        visible={this.props.visible}
        direction={this.props.direction}
        name="readingGroups"
      >
        <>
          {this.renderHeader()}
          <div className="annotation-group-options annotation-group-options--dark">
            {this.renderOptions()}
            {this.renderFooter()}
          </div>
          {this.renderBackButton()}
        </>
      </Panel>
    );
  }
}
