$(document).ready(function () {
    let myModal = new bootstrap.Modal(document.getElementById('taskModal'));
    let page = 1;
    let taskCount = 0;
    let moreResults = false;
    // console.log('jquery')
    function performSearch() {
        let searchType = $('#toggleSearchTypeButton').data('search-type');
        let search = $('#search').val();
        let searchMethod = $('#search').attr('data-method-search');
        let taskType = $('#type-filter').val();
        let data = { search: search, searchType: searchType, method: searchMethod, page: page, taskType: taskType };
        $.ajax({
            url: 'task-search.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                getTaskCount()
                // console.log('RES-> ' + res);
                let template = '';
                try {
                    let tasks = JSON.parse(res);
                    // console.log(tasks)
                    taskCount = Math.floor(tasks.data.length / 10);
                    $('#records').text(tasks.length)

                    // console.log('TIPO: '+typeof tasks.differencePages)
                    // console.log('TASK COUNT:' + taskCount)
                    // console.log('PAGE COUNT: ' + page)
                    // console.log('Total tasks: ' + tasks.data.length)
                    // console.log('-----------------------------')
                    tasks.data.forEach(task => {
                        // Truncar la descripción después de las primeras 5 palabras
                        let truncatedDescription = task['description'].split(' ').slice(0, 5).join(' ');
                        if (task['description'].split(' ').length > 5) {
                            truncatedDescription += '...';
                        }
                        template += `<tr class="table-${task['done'] == 1 ? 'success' : task['type'].toLowerCase()}" data-type="${task['type'].toLowerCase()}"> <td> ${task['id']} </td>`;
                        template += `<td>${task['name']} </td>`;
                        template += `<td>${truncatedDescription} </td>`; // Aquí se utiliza la descripción truncada
                        template += `<td><input id="${task['id']}" type="checkbox"  ${task['done'] == 1 ? "checked" : ""} > </td>`;
                        template += `<td><button data-id="${task['id']}" class="edit btn btn-sm btn-success  col-5 mr-5  text-center">Edit</button><span>&nbsp;</span><button data-id="${task['id']}" class="delete btn btn-sm btn-danger  col-6 ">Delete</button> </td></tr>`;
                    });
                    page -= tasks.differencePages;
                    moreResults = tasks.moreResults != 0;
                    // console.log(moreResults)
                    $('#page').html(page);

                    hidePaginationButtons();

                } catch (error) {
                    if (error instanceof Error) {

                    }
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
    $('body').on('click', '.delete', function (event) {
        event.stopPropagation();
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
        $('#sendForm').show();
        $('#type').prop('disabled', false);
        $('#description').prop('disabled', false);
        $('#name').prop('disabled', false);
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
        $('#sendForm').show();
        $('#type').prop('disabled', false);
        $('#description').prop('disabled', false);
        $('#name').prop('disabled', false);
        myModal.toggle();

    })

    $('#filterById').on('click', function () {
        // TODO : FIX THIS -------------->
        let type = $(this).attr('type');
        // console.log(type)
        type == 'desc' ? $(this).attr('type', 'asc') : $(this).attr('type', 'desc');
        type == 'desc' ? $(this).html('Id &#x25BC;') : $(this).html('Id &#x25B2;');
        $('#filterByName').html('Name &#x25B2; &#x25BC;');
        type == 'desc' ? $('#search').attr('data-method-search', 'id-desc') : $('#search').attr('data-method-search', 'id-asc');
        // console.log(type)
        // console.log(type.type)
        performSearch();
    })
    $('#filterByName').on('click', function () {
        let type = $(this).attr('type');
        type == 'desc' ? $(this).attr('type', 'asc') : $(this).attr('type', 'desc');
        type == 'desc' ? $(this).html('Name &#x25BC;') : $(this).html('Name &#x25B2;');
        $('#filterById').html('Id &#x25B2; &#x25BC;');
        type == 'desc' ? $('#search').attr('data-method-search', 'name-desc') : $('#search').attr('data-method-search', 'name-asc');

        // $('#search')
        // $(this).html('Name &#x25B2;')
        // console.log(type)
        // console.log(type.type)
        performSearch();
    })
    $('#previous').on('click', function () {
        if (page > 1) {
            page--;
            hidePaginationButtons();

            $('#page').html(page);
            performSearch();
        }
    });

    // Manejar clic en botón "Siguiente"
    $('#next').on('click', function () {
        if (page >= taskCount) {

            page++;
            hidePaginationButtons();
            // console.log(page)
            // console.log(taskCount)
            $('#page').html(page);
            performSearch();
        }
    });

    function hidePaginationButtons() {
        // console.log('Primero'+taskCount)
        if (moreResults) {
            $('#next').show();
        } else {
            $('#next').hide();
        }
        if (page != 1) {
            $('#previous').show();
        } else {
            $('#previous').hide();
        }
    }


    $('#tasks').on('click', 'tr', function (event) {
        // Obtener los valores de las celdas de la fila clicada
        if ($(event.target).hasClass('delete')) {
            return;
        }
        let id = $(this).find('td:eq(0)').text(); // Obtener el valor de la primera celda (ID)
        let data = { id: id };

        myModal.toggle();
        $('#sendForm').hide();
        $('#type').prop('disabled', true);
        $('#name').prop('disabled', true);
        $('#description').prop('disabled', true);

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
    });

    $('#type-filter').on('change', function () {
        performSearch();
    })

    function getTaskCount() {
        $.ajax({
            type: 'POST',
            url: 'task-searchCountAll.php',
            success: function (res) {
                let data = JSON.parse(res);
                $('#records').text(data.total_rows)
            }
        })
    }
})