import React from "react";
import PropTypes from "prop-types";

const PlaceholderWrapper = props => {
  const { children, context } = props;

  return (
    <section>
      <div className={`content-placeholder content-placeholder--${context}`}>
        {children}
      </div>
    </section>
  );
};

PlaceholderWrapper.propTypes = {
  context: PropTypes.oneOf(["frontend", "backend"])
};

PlaceholderWrapper.defaultProps = {
  context: "frontend"
};

PlaceholderWrapper.displayName = "ContentPlaceholder.Wrapper";

export default PlaceholderWrapper;
