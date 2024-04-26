$(document).ready(function () {
    console.log('jquery')
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
                        template += `<td><button data-id="${task['id']}" class="edit">Edit</button><button data-id="${task['id']}" class="delete">Delete</button> </td></tr>`;
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
    }
   
    clearForm();
    performSearch();

    // console.log('Jquery funciona')
    $('#search').keyup(function () {
        performSearch();
    });

    $('#task-form').submit(function (event) {
        event.preventDefault();
        let data = { name: $('#name').val(), description: $('#description').val(), type: $('#type').val(), id: $(this).attr('data-task-id') };
        // console.log(data)
        $.ajax({
            url: 'task-save.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                console.log(res)
                performSearch();
                clearForm();
            }
        })    })
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
        $.ajax({
            url: 'task-searchFromId.php',
            type: 'POST',
            data: {data},
            success: function(res){
                 res = JSON.parse(res);
                $('#name').val(res[0].name);
                $('#description').val(res[0].description);
                $('#type').val(res[0].type.toLowerCase());
                $('#task-form').attr('data-task-id', data.id);
            },
        })
    })
})