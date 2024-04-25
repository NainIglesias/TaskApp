$(document).ready(function () {
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
                        template += `<td> ${task['name']} </td>`;
                        template += `<td> ${task['description']} </td>`;
                        template += `<td> <input id="${task['id']}" type="checkbox"  ${task['done'] == 1 ? "checked" : ""} > </td> </tr>`;
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
        $('#type').find('option:selected').prop('selected', false);
        $('#type').find('option:first').prop('selected', true);
    }
    clearForm();
    performSearch();

    // console.log('Jquery funciona')
    $('#search').keyup(function () {
        performSearch();
    });
    $('#task-form').submit(function () {
        let data = { name: $('#name').val(), description: $('#description').val(), type: $('#type').val() };
        // console.log(data)
        $.ajax({
            url: 'task-save.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                // console.log(res)
                performSearch();
                clearForm();
            }
        })
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
    $('#toggleSearchTypeButton').on('click', function () {
        $(this).data('search-type') == 'name' ? $(this).data('search-type', 'description') : $(this).data('search-type', 'name')
        $(this).data('search-type') == 'name' ? $(this).html('By Name') : $(this).html('By Description')
        console.log('hi')
    })
})