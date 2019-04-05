import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Touch extends Component {
  static propTypes = {
    iconClass: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    iconClass: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 64;
  }

  get defaultWidth() {
    return 64;
  }

  get size() {
    return this.props.size;
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get viewBox() {
    return "0 0 64 64";
  }

  get classes() {
    const { iconClass } = this.props;
    return classnames("manicon-svg", iconClass);
  }

  get fill() {
    return this.props.fill;
  }

  get stroke() {
    return this.props.stroke;
  }

  render() {
    const baseSvgProps = {
      xmlns: "http://www.w3.org/2000/svg",
      className: this.classes,
      width: this.width,
      height: this.height,
      viewBox: this.viewBox,
      fill: this.fill
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M22.4544,20.5013551 C22.4849032,18.3450877 24.1416729,16.5614234 26.2405985,16.3777291 C27.3973531,16.2177435 28.568148,16.5506158 29.4677105,17.2952392 C30.367273,18.0398625 30.9130018,19.1278629 30.9732,20.3446 L30.9732,34.7194 C30.9732,35.2716848 30.5254847,35.7194 29.9732,35.7194 C29.4209152,35.7194 28.9732,35.2716848 28.9732,34.7194 L28.9744739,20.395059 C28.9438384,19.7886974 28.6601077,19.2230334 28.1924146,18.835895 C27.7247216,18.4487566 27.1160117,18.2756924 26.4653654,18.3644411 C25.3389458,18.4636848 24.4701947,19.3989749 24.4543,20.5155 L24.4543,43.7394 C24.4543,44.8671396 22.8783971,45.1322864 22.509358,44.0666379 C22.4915896,44.0153294 22.4536627,43.9108536 22.3963731,43.7609302 C22.2991403,43.5064778 22.1840759,43.2217844 22.0520315,42.9146235 C21.6750242,42.037632 21.2396764,41.1612451 20.7546882,40.3489399 C19.0380808,37.4737998 17.316058,36.3131673 15.6453843,37.2890793 C15.5120284,37.3669765 15.4406031,37.5819152 15.4793582,38.0232309 C15.5054767,38.3206509 15.5842005,38.6592176 15.6998444,39.0072012 C15.7902336,39.2791911 15.8795941,39.4924634 15.9316303,39.6004663 C17.1000653,42.0120002 17.7657686,44.6360022 17.8867857,47.2877325 C18.0095954,49.0163215 18.8773239,50.8472944 20.2610863,52.6475058 C20.799895,53.3484712 21.3790344,53.9945918 21.9575454,54.568547 C22.3016003,54.9098923 22.5649923,55.1479692 22.7067623,55.2667314 C23.1301265,55.6213879 23.1858251,56.2520982 22.8311686,56.6754624 C22.4765122,57.0988266 21.8458018,57.1545252 21.4224376,56.7998687 C21.2396635,56.6467569 20.9351031,56.3714685 20.5489335,55.98834 C19.9104037,55.3548388 19.2725022,54.6431599 18.6754061,53.8663653 C17.0741161,51.7831604 16.047176,49.6162391 15.8903452,47.4043091 C15.780257,44.9983742 15.181936,42.6399729 14.1308204,40.4705691 C14.0433932,40.2891201 13.9221346,39.9997183 13.8019049,39.6379353 C13.640959,39.1536338 13.5284308,38.6696848 13.4870257,38.1981917 C13.387712,37.0672769 13.7075415,36.1048211 14.6366076,35.5621255 C17.5953748,33.833783 20.2467845,35.6109531 22.4543191,39.2942773 L22.4544,20.5013551 Z M44.011,39.842 C44.011,40.3942848 43.5632848,40.842 43.011,40.842 C42.4587153,40.842 42.011,40.3942848 42.011,39.842 L42.0119948,36.8488056 C42.1135545,34.5736638 44.0359419,32.8091015 46.2295601,32.9023384 C48.5050581,32.8091015 50.4274456,34.5736638 50.53,36.8934 L50.53,56.0334 C50.53,56.5856848 50.0822848,57.0334 49.53,57.0334 C48.9777153,57.0334 48.53,56.5856848 48.53,56.0334 L48.5309949,36.9379944 C48.4785655,35.7634703 47.486148,34.8525288 46.2295601,34.9006616 C45.054852,34.8525288 44.0624346,35.7634703 44.011,36.8934 L44.011,39.842 Z M37.4921,37.2963 C37.4921,37.8485848 37.0443848,38.2963 36.4921,38.2963 C35.9398153,38.2963 35.4921,37.8485848 35.4921,37.2963 L35.4930949,34.6217043 C35.5946551,32.3466161 37.5169606,30.5820749 39.7104008,30.6752449 C41.9861514,30.5816343 43.9089488,32.3463023 44.0115,34.6663 L44.0115,41.4039 C44.0115,41.9561848 43.5637848,42.4039 43.0115,42.4039 C42.4592153,42.4039 42.0115,41.9561848 42.0115,41.4039 L42.0124945,34.7108879 C41.9600667,33.5362254 40.9674376,32.6252293 39.7105919,32.6735629 C38.5359099,32.6254686 37.5435348,33.5363993 37.4921,34.6663 L37.4921,37.2963 Z M30.9731,38.933 C30.9731,39.4852848 30.5253847,39.933 29.9731,39.933 C29.4208152,39.933 28.9731,39.4852848 28.9731,38.933 L28.9740948,32.1184057 C29.0756543,29.8432623 30.998004,28.0786756 33.191534,28.1718436 C35.4672894,28.0783085 37.3900489,29.8430007 37.4926,32.163 L37.4926,38.933 C37.4926,39.4852848 37.0448848,39.933 36.4926,39.933 C35.9403153,39.933 35.4926,39.4852848 35.4926,38.933 L35.4935945,32.2075878 C35.4411656,31.0328978 34.4485335,30.1218686 33.1916932,30.170163 C32.0169561,30.122068 31.0245357,31.0330427 30.9731,32.163 L30.9731,38.933 Z M25.4678,6.96669996 L27.4678,6.96669996 L27.4678,12.0593 L25.4678,12.0593 L25.4678,6.96669996 Z M34.8189651,9.74485636 L36.2910349,11.0987436 L32.9791349,14.6997436 L31.5070651,13.3458564 L34.8189651,9.74485636 Z M39.3191,17.7632 L39.3191,19.7632 L34.6353,19.7632 L34.6353,17.7632 L39.3191,17.7632 Z M18.3003,17.7632 L18.3003,19.7632 L13.6165,19.7632 L13.6165,17.7632 L18.3003,17.7632 Z M21.4285349,13.3458564 L19.9564651,14.6997436 L16.6445651,11.0987436 L18.1166349,9.74485636 L21.4285349,13.3458564 Z" />
      </svg>
    );
  }
}
