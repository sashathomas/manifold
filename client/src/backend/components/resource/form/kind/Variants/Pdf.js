import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindVariantsPdf extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants.Pdf";

  static propTypes = {
    kind: PropTypes.string
  };

  render() {
    return (
      <div className="form-section form-section--primary">
        <Form.Upload
          layout="square"
          label="Thumbnail Image"
          accepts="images"
          readFrom="attributes[variantThumbnailStyles][small]"
          name="attributes[variantThumbnail]"
          remove="attributes[removeVariantThumbnail]"
          {...this.props}
        />
      </div>
    );
  }
}
