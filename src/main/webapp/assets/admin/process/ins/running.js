$(function() {
	$('#dg-list').datagrid({
		fit : true,
		striped : true,
		border : true,
		idField : 'id',
		rownumbers : true,
		fitColumns : true,
		singleSelect : false,
		pagination : true,
		pageSize : 15,
		pageList : [10, 15, 20],
		url : 'admin/process/ins/data/running',
		queryParams : {},
		method : 'get',
		frozenColumns : [[{
					field : 'ck',
					checkbox : true
				}]],
		columns : [[{
					"field" : "id",
					"title" : "实例ID"
				}, {
					// 流程实例名称存在BUG，不会记录到历史中
					"field" : "name",
					"hidden" : true
				}, {
					"field" : "processDefinitionId",
					"title" : "编号"
				}, {
					"field" : "processDefinitionKey",
					"title" : "KEY"
				}, {
					"field" : "processDefinitionName",
					"title" : "名称"
				}, {
					"field" : "startUserId",
					"title" : "发起用户ID"
				}, {
					"field" : "startUser",
					"title" : "发起员工"
				}, {
					"field" : "startTime",
					"title" : "发起时间",
					formatter : function(value, row, index) {
						if (value) {
							var date = new Date(value);
							return date.format('yyyy-MM-dd HH:mm:ss');
						}
					}
				}]],
		loadMsg : '数据载入中...'
	});
	$('#dg-list').datagrid('getPager').pagination({
		beforePageText : '第',
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示 {from} - {to} 条记录    共 {total} 条记录'
	});
});

function search(value, name) {
	$('#dg-list').datagrid('clearSelections');
	$('#dg-list').datagrid('reload', {
		params : '{ "' + name + '" : "' + value + '" }'
	});
}

function func_del() {
	var rows = $('#dg-list').datagrid('getSelections');
	if (rows.length > 0) {
		$.messager.confirm('提示', '确定删除已选择的条目？', function(r) {
			if (r) {
				var ids = new Array();
				$.each(rows, function(i, row) {
					ids.push(row.id);
				});
				$.ajax({
					type : 'delete',
					url : 'admin/process/ins/batch?ids=' + ids,
					dataType : 'json',
					async : true,
					success : function(data) {
						if (data.success) {
							$('#dg-list').datagrid('reload');
							$('#dg-list').datagrid('clearSelections');
						} else {
							// 出错也需要重载
							$('#dg-list').datagrid('reload');
							$('#dg-list').datagrid('clearSelections');
							$.messager.show({
								title : '错误',
								msg : data.msg,
								showType : 'fade',
								style : {
									right : '',
									bottom : ''
								}
							});
						}
					},
					error : function() {
						// 出错也需要重载
						$('#dg-list').datagrid('reload');
						$('#dg-list').datagrid('clearSelections');
						$.messager.show({
							title : '错误',
							msg : '服务器正忙，请稍后再试！',
							showType : 'fade',
							style : {
								right : '',
								bottom : ''
							}
						});
					}
				});
			}
		});
	} else {
		$.messager.alert('提示', '请选择要删除的条目！', 'info');
	}
}

function func_reload() {
	$('#searchbox').searchbox('setValue', '');
	$('#dg-list').datagrid('clearSelections');
	$('#dg-list').datagrid('reload', {});
}

function func_state() {
	var rows = $('#dg-list').datagrid('getSelections');
	if (rows.length == 0) {
		$.messager.alert('提示', '请选择要激活/挂起的条目！', 'info');
	} else if (rows.length == 1) {
		var url = '';
		var title = '';
		var msg = '';
		if (rows[0].isSuspended) {
			// 激活操作
			url = 'admin/process/ins/' + rows[0].id + '/state/active';
			title = '激活成功';
			msg = rows[0].id + '已被成功激活';
		} else {
			// 挂起操作
			url = 'admin/process/ins/' + rows[0].id + '/state/suspend';
			title = '挂起成功';
			msg = rows[0].id + '已被成功挂起';
		}
		if (url) {
			$.ajax({
				type : 'put',
				url : url,
				dataType : 'json',
				async : true,
				success : function(data) {
					if (data.success) {
						$('#dg-list').datagrid('reload');
						/*$('#dg-list').datagrid('clearSelections');
						$.messager.show({
							title : title,
							msg : msg,
							showType : 'fade',
							style : {
								right : '',
								bottom : ''
							}
						});*/
					} else {
						$.messager.show({
							title : '错误',
							msg : data.msg,
							showType : 'fade',
							style : {
								right : '',
								bottom : ''
							}
						});
					}
				},
				error : function() {
					$.messager.show({
						title : '错误',
						msg : '服务器正忙，请稍后再试！',
						showType : 'fade',
						style : {
							right : '',
							bottom : ''
						}
					});
				}
			});
		}
	} else {
		$.messager.alert('提示', '激活/挂起时只可以选择一个！', 'info');
	}
}

function func_view(type) {
	var rows = $('#dg-list').datagrid('getSelections');
	if (rows.length == 0) {
		$.messager.alert('提示', '请选择要预览的条目！', 'info');
	} else if (rows.length == 1) {
		var url = AppCore.baseUrl + 'admin/process/ins/' + rows[0].id + '/resource/' + type;
		if (type == 'img') {
			$('#dlg-view').dialog({
				content : '<img src="' + url + '"/>'
			}).dialog('open');
		}
	} else {
		$.messager.alert('提示', '预览时只可以选择一个！', 'info');
	}
}

function func_task() {
	var rows = $('#dg-list').datagrid('getSelections');
	if (rows.length == 0) {
		$.messager.alert('提示', '请选择要查看的条目！', 'info');
	} else if (rows.length == 1) {
		$('#dg-task').datagrid({
			striped : true,
			border : true,
			idField : 'id',
			rownumbers : true,
			fitColumns : true,
			singleSelect : true,
			url : 'admin/process/ins/' + rows[0].id + '/tasks',
			queryParams : {},
			method : 'get',
			columns : [[{
						"field" : "id",
						"title" : "ID"
					}, {
						"field" : "taskDefinitionKey",
						"title" : "KEY"
					}, {
						"field" : "name",
						"title" : "名称"
					}, {
						"field" : "formKey",
						"title" : "FormKey"
					}, {
						"field" : "assignee",
						"title" : "办理用户ID"
					}, {
						"field" : "assigneeName",
						"title" : "办理人"
					}, {
						"field" : "createTime",
						"title" : "创建时间",
						formatter : function(value, row, index) {
							if (value) {
								var date = new Date(value);
								return date.format('yyyy-MM-dd HH:mm:ss');
							}
						}
					}, {
						"field" : "claimTime",
						"title" : "签收时间",
						formatter : function(value, row, index) {
							if (value) {
								var date = new Date(value);
								return date.format('yyyy-MM-dd HH:mm:ss');
							} else {
								return '自动签收';
							}
						}
					}, {
						"field" : "endTime",
						"title" : "结束时间",
						formatter : function(value, row, index) {
							if (value) {
								var date = new Date(value);
								return date.format('yyyy-MM-dd HH:mm:ss');
							}
						}
					}]],
			loadMsg : '数据载入中...'
		});
		$('#dlg-task').dialog('open');
	} else {
		$.messager.alert('提示', '查看时只可以选择一个！', 'info');
	}
}

function func_data() {
	var rows = $('#dg-list').datagrid('getSelections');
	if (rows.length == 0) {
		$.messager.alert('提示', '请选择要查看的条目！', 'info');
	} else if (rows.length == 1) {
		$('#dg-data').datagrid({
			striped : true,
			border : true,
			idField : 'id',
			rownumbers : true,
			fitColumns : true,
			singleSelect : true,
			url : 'admin/process/ins/' + rows[0].id + '/datas',
			queryParams : {},
			method : 'get',
			columns : [[{
						"field" : "id",
						"title" : "ID"
					}, {
						"field" : "variableTypeName",
						"title" : "类型"
					}, {
						"field" : "name",
						"title" : "名称"
					}, {
						"field" : "value",
						"title" : "值"
					}]],
			loadMsg : '数据载入中...'
		});
		$('#dlg-data').dialog('open');
	} else {
		$.messager.alert('提示', '查看时只可以选择一个！', 'info');
	}
}