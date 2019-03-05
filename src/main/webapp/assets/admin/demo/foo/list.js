var selected = null;
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
		url : 'admin/demo/foo/data',
		queryParams : {},
		method : 'get',
		frozenColumns : [[{
			field : 'ck',
			checkbox : true
		}]],
		columns : [[{
			"field" : "col1",
			"title" : "整型"
		}, {
			"field" : "col2",
			"title" : "字符串"
		}, {
			"field" : "col3",
			"title" : "小数"
		}, {
			"field" : "col4",
			"title" : "日期"
		}, {
			"field" : "col5",
			"title" : "日期时间"
		}, {
			"field" : "col6",
			"title" : "文本"
		}]],
		loadMsg : '数据载入中...',
		onLoadError : function() {
			// 该方法会在请求失败后执行
			// 这里使用测试数据填充DataGrid，便于调试页面
			var tmp = [
				{"col1":11,"col2":"A","col3":11.11,"col4":"2017-01-01","col5":"2017-01-01 12:00:00","col6":"temp text"},
				{"col1":22,"col2":"B","col3":22.22,"col4":"2017-02-01","col5":"2017-02-01 12:00:00","col6":"temp text"},
				{"col1":33,"col2":"C","col3":33.33,"col4":"2017-03-01","col5":"2017-03-01 12:00:00","col6":"temp text"}
			];
			$(this).datagrid('loadData', tmp);
		}
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

// 多行添加代码
var editIndex = undefined;
function endEditing() {
	if (editIndex == undefined) {
		return true;
	}
	if ($('#dg-add').datagrid('validateRow', editIndex)) {
		$('#dg-add').datagrid('endEdit', editIndex);
		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}
function onClickRow(index) {
	if (editIndex != index) {
		if (endEditing()) {
			$('#dg-add').datagrid('selectRow', index).datagrid('beginEdit', index);
			editIndex = index;
		} else {
			$('#dg-add').datagrid('selectRow', editIndex);
		}
	}
}
function appendLine() {
	if (endEditing()) {
		$('#dg-add').datagrid('appendRow', {});
		editIndex = $('#dg-add').datagrid('getRows').length - 1;
		$('#dg-add').datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
	}
}
function removeLine() {
	if (editIndex == undefined) {
		return;
	}
	$('#dg-add').datagrid('cancelEdit', editIndex).datagrid('deleteRow', editIndex);
	editIndex = undefined;
}

function dlg_add() {
	$('#dg-add').datagrid({
		striped : true,
		border : true,
		idField : 'id',
		rownumbers : true,
		fitColumns : true,
		singleSelect : true,
		// 多行增加的列的列宽、控件类型需要后期修改
		columns : [[{
			"field" : "col5",
			"title" : "日期时间",
			"width" : 80,
			"editor" : {
				"type" : "textbox",
				"options" : {
					"required" : true
				}
			}
		}, {
			"field" : "col4",
			"title" : "日期",
			"width" : 80,
			"editor" : {
				"type" : "textbox",
				"options" : {
					"required" : true
				}
			}
		}, {
			"field" : "col6",
			"title" : "文本",
			"width" : 80,
			"editor" : {
				"type" : "textbox",
				"options" : {
					"required" : true
				}
			}
		}, {
			"field" : "col1",
			"title" : "整型",
			"width" : 80,
			"editor" : {
				"type" : "textbox",
				"options" : {
					"required" : true
				}
			}
		}, {
			"field" : "col3",
			"title" : "小数",
			"width" : 80,
			"editor" : {
				"type" : "textbox",
				"options" : {
					"required" : true
				}
			}
		}, {
			"field" : "col2",
			"title" : "字符串",
			"width" : 80,
			"editor" : {
				"type" : "textbox",
				"options" : {
					"required" : true
				}
			}
		}]],
		loadMsg : '数据载入中...',
		onClickRow : onClickRow
	});
	$('#dlg-add').dialog({
		onResize : function() {
			$('#dg-add').datagrid('resize');
		},
		onClose : function() {
			editIndex = undefined;
			$('#dg-add').datagrid('loadData', {
				total : 0,
				rows : []
			});
		}
	}).dialog('open');
}
function func_add() {
	if (endEditing()) {
		$('#dg-add').datagrid('acceptChanges');
		// 数据处理
		var data = $('#dg-add').datagrid('getData');
		$.ajax({
			type : 'post',
			url : 'admin/demo/foo/batch',
			data : {
				objs : JSON.stringify(data.rows)
			},
			dataType : 'json',
			async : true,
			success : function(data) {
				if (data.success) {
					$('#dg-list').datagrid('reload');
					$('#dg-list').datagrid('clearSelections');
					$('#dlg-add').dialog('close');
				} else {
					// 出错也需要重载，避免重复数据
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
				// 出错也需要重载，避免重复数据
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
}

function dlg_edit() {
	var rows = $('#dg-list').datagrid('getSelections');
	if (rows.length == 0) {
		$.messager.alert('提示', '请选择要修改的条目！', 'info');
	} else if (rows.length == 1) {
		$('#id-edit').val(rows[0].id);
		$('#fm-edit').form('load', rows[0]);
		$('#dlg-edit').dialog('open');
	} else {
		$.messager.alert('提示', '修改条目时只可以选择一个！', 'info');
	}
}
function func_edit() {
	// 将表单序列化为json对象
	var data = $('#fm-edit').serializeObj();
	if ($('#fm-edit').form('validate')) {
		$.ajax({
			type : 'put',
			url : 'admin/demo/foo/' + $('#id-edit').val(),
			data : {
				obj : JSON.stringify(data)
			},
			dataType : 'json',
			async : true,
			success : function(data) {
				if (data.success) {
					$('#dg-list').datagrid('reload');
					$('#dg-list').datagrid('clearSelections');
					$('#dlg-edit').dialog('close');
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
					url : 'admin/demo/foo/batch?ids=' + ids,
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