import React, { Component } from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/with-confirmation";
import Form from "global/components/form";
import setter from "global/components/form/setter";
import GlobalForm from "global/components/form";
import ColorPicker from "./ColorPicker";
import UniqueIcons from "global/components/icon/unique";
import classNames from "classnames";

class AvatarBuilder extends Component {
  static displayName = "Project.Form.AvatarBuilder";

  static propTypes = {
    project: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    errors: PropTypes.array,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  onColorChange = color => {
    if (
      this.props.getModelValue("attributes[avatar][data]") ||
      this.props.getModelValue("attributes[avatarStyles][smallSquare]")
    ) {
      return this.handleColorChange(color);
    }
    this.setAvatarColor(color);
  };

  onUploadChange = image => {
    if (!image) return this.removeAvatar();
    this.setAvatarImage(image);
  };

  setAvatarImage(image) {
    if (!image) return null;
    this.props.setOther(false, "attributes[removeAvatar]");
    this.props.setOther(image, "attributes[avatar]");
  }

  setAvatarColor(color) {
    if (!color) return null;
    this.props.setOther(color.value, "attributes[avatarColor]");
  }

  handleColorChange = color => {
    const heading =
      "Changing this will remove the project's current avatar image";
    const message = "Do you wish to proceed?";
    this.props.confirm(heading, message, () => {
      this.removeAvatar();
      this.setAvatarColor(color);
    });
  };

  removeAvatar() {
    this.props.setOther(true, "attributes[removeAvatar]");
    this.props.setOther(null, "attributes[avatarStyles][smallSquare]");
    this.props.setOther(null, "attributes[avatar]");
  }

  renderCoverImage(image) {
    if (!image) return null;
    const title = this.props.getModelValue("attributes[title]");
    return (
      <div
        role="img"
        aria-label={`Thumbnail for ${title}`}
        className="preview"
        style={{ backgroundImage: `url(${image})` }}
      />
    );
  }

  renderPlaceholderImage() {
    if (!this.props.getModelValue("attributes[avatarColor]")) return null;
    return (
      <div className="preview">
        <UniqueIcons.ProjectPlaceholderUnique
          color={this.props.getModelValue("attributes[avatarColor]")}
        />
      </div>
    );
  }

  render() {
    const image =
      this.props.getModelValue("attributes[avatar][data]") ||
      this.props.getModelValue("attributes[avatarStyles][smallSquare]");
    const inputClasses = classNames({
      "form-input avatar-builder": true,
      wide: this.props.wide
    });
    const uploadClasses = classNames({
      section: true,
      upload: true,
      active: image
    });
    const pickerClasses = classNames({
      section: true,
      color: true,
      active: !image
    });

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name="attributes[avatar]"
        errors={this.props.errors}
        label="Avatar"
      >
        <div className={inputClasses}>
          <div className="form-input-heading">Project Thumbnail</div>
          <div className="grid">
            <div className="section current">
              <span className="label" aria-hidden="true">
                Current
              </span>
              <span className="label screen-reader-text">
                Current Project Thumbnail
              </span>
              {image
                ? this.renderCoverImage(image)
                : this.renderPlaceholderImage()}
            </div>
            <div className={pickerClasses}>
              <span className="label" aria-hidden="true">
                Default
              </span>
              <ColorPicker
                onChange={this.onColorChange}
                value={this.props.getModelValue("attributes[avatarColor]")}
                label="Default Thumbnail Background Color"
                {...this.props}
              />
            </div>
            <div className={uploadClasses}>
              <span className="label" aria-hidden="true">
                Custom
              </span>
              <Form.Upload
                set={this.onUploadChange}
                initialValue={this.props.getModelValue(
                  "attributes[avatarStyles][smallSquare]"
                )}
                value={this.props.getModelValue("attributes[avatar]")}
                placeholder="cover"
                accepts="images"
                label="Custom Thumbnail Image"
                labelClass="screen-reader-text"
              />
            </div>
          </div>
        </div>
      </GlobalForm.Errorable>
    );
  }
}

export default withConfirmation(setter(AvatarBuilder));
