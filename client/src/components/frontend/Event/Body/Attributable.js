import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Autolinker from 'autolinker';

export default class EventBodyAttributable extends Component {

  static displayName = "Event.Body.Attributable";

  static propTypes = {
    event: PropTypes.object,
    icon: PropTypes.string,
  };

  autoLink(excerpt) {
    const options = {
      mention: "twitter",
      hashtag: "twitter"
    };
    return {
      __html: Autolinker.link(excerpt, options)
    };
  }

  render() {
    const attr = this.props.event.attributes;
    const iconClass = 'manicon manicon-' + this.props.icon;

    return (
      <div className="event-data">
        {/* Event-data requires a classless empty div for vertical alignment */}
        <div>
          <i className={iconClass}></i>
          <div className="event-user">
            <a href={`https://twitter.com/${attr.attributionIdentifier}`}>
              {'@' + attr.attributionIdentifier}
            </a>
          </div>
          <div className="event-content">
            <p dangerouslySetInnerHTML={this.autoLink(attr.excerpt)} />
          </div>
          <datetime className="event-date">
            {moment(attr.createdAt).format("MMMM Do, YYYY")}
          </datetime>
        </div>
      </div>
    );
  }
}
