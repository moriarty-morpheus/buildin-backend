const permissions = {
  'get_users_list': ['v0_get_all_users'],
	'update_user_approval_status': ['v0_approve_users'],
	'update_user_active_status': ['v0_activate_users'],
  'add_complaint': ['v0_add_complaint'],
  'edit_complaint': ['v0_edit_complaint'],
  'delete_complaint': ['v0_delete_complaint'],
  'get_complaint': ['v0_get_complaint'],
  'get_own_complaints_list': ['v0_get_complaint'],
  'get_all_complaints_list': ['v0_get_all_complaints'],
  'get_my_data': ['v0_get_user'],
  'get_tabs_list': ['v0_get_tabs']
}
module.exports = permissions;
