$(document).ready(function () {
    let myModal = new bootstrap.Modal(document.getElementById('taskModal'));

    // console.log('jquery')
    function performSearch() {
        let searchType = $('#toggleSearchTypeButton').data('search-type');
        let search = $('#search').val();
        let data = { search: search, searchType: searchType };

        $.ajax({
            url: 'task-search.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                // console.log(res);
                let template = '';
                try {
                    let tasks = JSON.parse(res);
                    tasks.forEach(task => {
                        template += `<tr class="table-${task['done'] == 1 ? 'success' : task['type'].toLowerCase()}" data-type="${task['type'].toLowerCase()}"> <td> ${task['id']} </td>`;
                        template += `<td>${task['name']} </td>`;
                        template += `<td>${task['description']} </td>`;
                        template += `<td><input id="${task['id']}" type="checkbox"  ${task['done'] == 1 ? "checked" : ""} > </td>`;
                        template += `<td><button data-id="${task['id']}" class="edit btn btn-sm btn-success d-inline col-5 mr-5">Edit</button><button data-id="${task['id']}" class="delete btn btn-sm btn-danger d-inline col-6">Delete</button> </td></tr>`;
                    });
                } catch (error) {
                    template = '';
                }
                $('#tasks').html(template);
            }
        });
    }
    function clearForm() {

        $('#task-form').find('input[type="text"], textarea').val('');
        $('#task-form').attr('data-task-id', '');
        $('#type').find('option:selected').prop('selected', false);
        $('#type').find('option:first').prop('selected', true);
        clearNameErrors();
        clearDescriptionErrors();
    }

    $('#closeModal').on('click', function () {
        clearForm();
    })

    clearForm();
    performSearch();

    // console.log('Jquery funciona')
    $('#search').keyup(function () {
        performSearch();
    });

    function clearNameErrors() {
        $('#nameErrors').css('display', 'none');
        $('#nameErrors').html('')
    }
    function clearDescriptionErrors() {
        $('#descriptionErrors').css('display', 'none');
        $('#descriptionErrors').html('')
    }
    $('#task-form').submit(function (event) {
        event.preventDefault();
        if (($('#name').val()).length <= 3) {
            // console.log(($('#name').val()))
            $('#nameErrors').css('display', 'block');
            $('#nameErrors').html('Name field must have a length greater than 3')

        } else {
            clearNameErrors();
        }
        if (($('#description').val()).length <= 5) {
            // console.log(($('#description').val()).length)
            $('#descriptionErrors').css('display', 'block');
            $('#descriptionErrors').html('Description field must have a length greater than 5')
        } else {
            clearDescriptionErrors();
        }
        if (($('#name').val()).length > 3 && ($('#description').val()).length > 5) {
            let data = { name: $('#name').val(), description: $('#description').val(), type: $('#type').val(), id: $(this).attr('data-task-id') };
            // console.log(data)
            $.ajax({
                url: 'task-save.php',
                type: 'POST',
                data: { data },
                success: function (res) {
                    // console.log(res)
                    performSearch();
                    clearForm();
                    myModal.hide();
                }
            })
        }
    })
    $(document).on('click', 'input[type="checkbox"]', function () {
        // console.log(checkboxId)
        let data = { id: $(this).attr('id'), state: $(this).prop('checked') ? 1 : 0 };
        // console.log(data)
        let newClass = $(this).prop('checked') ? 'table-success' : 'table-' + $(this).closest('tr').data('type');
        // console.log(newClass)
        $(this).closest('tr').removeClass().addClass(newClass);
        // console.log($($(this).attr()))
        $.ajax({
            url: 'task-save.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                // console.log(res)
            }
        })
    })
    $('#toggleSearchTypeButton').on('click', function (event) {
        event.preventDefault();
        $(this).data('search-type') == 'name' ? $(this).data('search-type', 'description') : $(this).data('search-type', 'name')
        $(this).data('search-type') == 'name' ? $(this).html('By Name') : $(this).html('By Description')
        // console.log('hi')
    })
    $('body').on('click', '.delete', function () {
        let data = { id: $(this).data('id') };
        // console.log('delete')
        $.ajax({
            url: 'task-delete.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                // console.log(res)
                performSearch()
            },
            error: function (xhr, status, error) {
                console.error('Error: ' + error);
            },
        })
    })
    $('body').on('click', '.edit', function () {
        let data = { id: $(this).data('id') };

        myModal.toggle();
        $.ajax({
            url: 'task-searchFromId.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                res = JSON.parse(res);
                $('#name').val(res[0].name);
                $('#description').val(res[0].description);
                $('#type').val(res[0].type.toLowerCase());
                $('#task-form').attr('data-task-id', data.id);
            },
        })
    })
    $('#buttonModal').on('click', function () {
        myModal.toggle();

    })

    $('#filterById').on('click', function () {
        let type = $(this).attr('type');
        type == 'desc' ? $(this).attr('type', 'asc') : $(this).attr('type', 'desc');
        console.log(type)
        // console.log(type.type)
        $.ajax({
            url: 'task-searchById.php',
            type: 'POST',
            data: { type: type },
            success: function (res) {
                let template = '';
                try {
                    let tasks = JSON.parse(res);
                    tasks.forEach(task => {
                        template += `<tr class="table-${task['done'] == 1 ? 'success' : task['type'].toLowerCase()}" data-type="${task['type'].toLowerCase()}"> <td> ${task['id']} </td>`;
                        template += `<td>${task['name']} </td>`;
                        template += `<td>${task['description']} </td>`;
                        template += `<td><input id="${task['id']}" type="checkbox"  ${task['done'] == 1 ? "checked" : ""} > </td>`;
                        template += `<td><button data-id="${task['id']}" class="edit btn btn-sm btn-success d-inline col-5 mr-5">Edit</button><button data-id="${task['id']}" class="delete btn btn-sm btn-danger d-inline col-6">Delete</button> </td></tr>`;
                    });
                } catch (error) {
                    template = '';
                    console.error(error)
                }
                $('#tasks').html(template);
            }
        })
    })
    $('#filterByName').on('click', function () {
        let type = $(this).attr('type');
        type == 'desc' ? $(this).attr('type', 'asc') : $(this).attr('type', 'desc');
        console.log(type)
        // console.log(type.type)
        $.ajax({
            url: 'task-searchByName.php',
            type: 'POST',
            data: { type: type },
            success: function (res) {
                let template = '';
                try {
                    let tasks = JSON.parse(res);
                    tasks.forEach(task => {
                        template += `<tr class="table-${task['done'] == 1 ? 'success' : task['type'].toLowerCase()}" data-type="${task['type'].toLowerCase()}"> <td> ${task['id']} </td>`;
                        template += `<td>${task['name']} </td>`;
                        template += `<td>${task['description']} </td>`;
                        template += `<td><input id="${task['id']}" type="checkbox"  ${task['done'] == 1 ? "checked" : ""} > </td>`;
                        template += `<td><button data-id="${task['id']}" class="edit btn btn-sm btn-success d-inline col-5 mr-5">Edit</button><button data-id="${task['id']}" class="delete btn btn-sm btn-danger d-inline col-6">Delete</button> </td></tr>`;
                    });
                } catch (error) {
                    template = '';
                    console.error(error)
                }
                $('#tasks').html(template);
            }
        })
    })
})