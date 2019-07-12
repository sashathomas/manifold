import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Table from "global/components/table/index";
import MemberRow from "./Row";

export default class MembersTable extends PureComponent {
  static propTypes = {
    members: PropTypes.array.isRequired
  };

  get members() {
    return this.props.members;
  }

  get pagination() {
    return this.props.pagination;
  }

  get onPageClick() {
    return this.props.onPageClick;
  }

  render() {
    return (
      <Table
        models={this.members}
        pagination={this.pagination}
        rowComponent={MemberRow}
        onPageClick={this.onPageClick}
        countLabel={"Members"}
      />
    );
  }
}