import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { Project, ResourceList } from 'components/frontend';
import fakeData from 'helpers/fakeData';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select, meta } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectEventsContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const page = params.page ? params.page : 1;
    const projectRequest =
        request(projectsAPI.show(params.id), requests.showProjectDetail);
    const eventRequest =
      request(projectsAPI.events(params.id, { number: page }), requests.showProjectEvents);
    const { promise: one } = dispatch(projectRequest);
    const { promise: two } = dispatch(eventRequest);
    return Promise.all([one, two]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.showProjectDetail, state.entityStore),
      events: select(requests.showProjectEvents, state.entityStore),
      meta: meta(requests.showProjectEvents, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object,
    events: PropTypes.array,
    meta: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const events = this.props.events;
    const eventsMeta = this.props.meta;
    if (!events) return null;
    return (
      <Project.Events
        project={project}
        events={events}
        pagination={eventsMeta.pagination}
      />
    );

  }
}

const ProjectEvents = connect(
    ProjectEventsContainer.mapStateToProps
)(ProjectEventsContainer);

export default ProjectEvents;
