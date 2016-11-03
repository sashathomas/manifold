
# The base application controller
class ApplicationController < ActionController::API
  include Authentication
  include Validation
  include JsonApi

  protected

  def page_size
    params.dig(:page, :size) || 20
  end

  def page_number
    params.dig(:page, :number) || 1
  end

  def pagination_dict(object)
    {
      current_page: object.current_page,
      next_page: object.next_page,
      prev_page: object.prev_page, # use object.previous_page when using will_paginate
      total_pages: object.total_pages,
      total_count: object.total_count
    }
  end
end
