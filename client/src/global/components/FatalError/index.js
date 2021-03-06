import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import BodyClass from "hoc/body-class";
import ApiTrace from "./ApiTrace";
import ClientTrace from "./ClientTrace";
import config from "config";
import IconComposer from "global/components/utility/IconComposer";

export default class FatalError extends PureComponent {
  static propTypes = {
    fatalError: PropTypes.shape({
      error: PropTypes.object,
      type: PropTypes.string
    }).isRequired,
    headerLineOne: PropTypes.string.isRequired,
    headerLineTwo: PropTypes.string.isRequired,
    dismiss: PropTypes.func
  };

  static defaultProps = {
    headerLineOne: "We're at a bit of a loose end.",
    headerLineTwo: "Frightfully sorry."
  };

  get error() {
    const { error } = this.props.fatalError;
    return error;
  }

  get apiTrace() {
    if (!this.error || !this.error.apiTrace) return null;
    return this.error.apiTrace;
  }

  get clientTrace() {
    if (!this.error || !this.error.clientTrace) return null;
    return this.error.clientTrace;
  }

  get clientTraceTruncate() {
    if (!this.error || !this.error.clientTraceTruncate) return null;
    return this.error.clientTraceTruncate;
  }

  render() {
    if (!this.props.fatalError) return null;
    const { error } = this.props.fatalError;
    const showDetail = config.environment.isDevelopment;

    return (
      <BodyClass className="browse fatal-error-page">
        <section className="fatal-error">
          <div className="error-wrapper">
            <div className="container">
              <header>
                <IconComposer
                  icon="stopSign64"
                  size={60}
                  iconClass="fatal-error__stop-icon"
                />
                <h3>
                  {this.props.headerLineOne}
                  {this.props.headerLineTwo ? (
                    <span>
                      <br />
                      {this.props.headerLineTwo}
                    </span>
                  ) : null}
                </h3>
              </header>

              <div
                className="error-description"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                {error ? (
                  <h1>
                    {error.status} Error: {error.heading}
                  </h1>
                ) : null}
                {showDetail ? (
                  <p>
                    {error.body}
                    {this.props.dismiss ? (
                      <span>
                        <br />
                        <button
                          role="link"
                          onClick={this.props.dismiss}
                          className="dismiss"
                        >
                          Try again.
                        </button>
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </div>
            {showDetail ? (
              <div>
                {this.apiTrace ? <ApiTrace trace={this.apiTrace} /> : null}
                {this.clientTrace ? (
                  <ClientTrace
                    trace={this.clientTrace}
                    truncate={this.clientTraceTruncate}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </BodyClass>
    );
  }
}
