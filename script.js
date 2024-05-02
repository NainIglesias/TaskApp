$(document).ready(function () {
    let confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    let confirmDonedModal = new bootstrap.Modal(document.getElementById('confirmDonedModal'));
    let graficModal = new bootstrap.Modal(document.getElementById('graficModal'));
    let myModal = new bootstrap.Modal(document.getElementById('taskModal'));
    let page = 1;
    let taskCount = 0;
    let moreResults = false;
    let deleteId = 0;
    let donedId = 0;
    let grafico; // CANVAS PARA CHART.JS 
    let weeksOffSet = 0;

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
                        template += `<td><input id="${task['id']}" type="checkbox"  ${task['done'] == 1 ? "checked" : ""} ${task['done'] == 1 ? "disabled" : ""}> </td>`;
                        template += `<td><button data-id="${task['id']}" class="edit btn btn-sm btn-success  col-5 mr-5  text-center" ${task['done'] == 1 ? "disabled" : ""}>Edit</button><span>&nbsp;</span><button data-id="${task['id']}" class="delete btn btn-sm btn-danger  col-6 ">Delete</button> </td></tr>`;
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

    $('#closeModal').on('click', function () {
        clearForm();
    })

    clearForm();
    performSearch();

    // console.log('Jquery funciona')
    $('#search').keyup(function () {
        performSearch();
    });

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
                    console.log(res)
                    performSearch();
                    clearForm();
                    showUserFeedback(res, true);
                    myModal.hide();
                },
                error: function (error) {
                    showUserFeedback('Problema en la inserción', false);
                }
            })
        }
    })
    $(document).on('click', 'input[type="checkbox"]', function (event) {
        // console.log(checkboxId)
        event.preventDefault();
        confirmDonedModal.toggle();
        donedId = $(this).attr('id');
        console.log(donedId)
        $('#idDoned').text(donedId);


    })
    $('#toggleSearchTypeButton').on('click', function (event) {
        event.preventDefault();
        $('#search').val('');
        $(this).data('search-type') == 'name' ? $(this).data('search-type', 'description') : $(this).data('search-type', 'name')
        $(this).data('search-type') == 'name' ? $(this).html('By Name') : $(this).html('By Description')
        performSearch();
        // console.log('hi')
    })
    $('body').on('click', '.delete', function (event) {
        event.stopPropagation();
        deleteId = $(this).data('id');
        $('#idDelete').text(deleteId);
        confirmDeleteModal.toggle();

    })

    $('#deleteButton').on('click', function (event) {
        let data = { id: deleteId };
        confirmDeleteModal.toggle();

        // console.log('delete')
        $.ajax({
            url: 'task-delete.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                // alert(res)
                performSearch();
                showUserFeedback('Registro eliminado correctamente', true);

            },
            error: function (error) {
                showUserFeedback('Problema en la eliminación', false);
            }
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
        $('#description').css('resize', 'vertical');

        myModal.toggle();

    })

    $('#filterById').on('click', function () {
        // TODO : FIX THIS -------------->
        let type = $(this).attr('type');
        // console.log(type)
        // console.log(type == 'desc' )
        // console.log(type == 'desc')
        // console.log('click')
        // console.log(type)
        type == 'desc' ? $(this).attr('type', 'asc') : $(this).attr('type', 'desc');
        type == 'desc' ? $(this).html('Id &#x25BC;') : $(this).html('Id &#x25B2;');
        $('#filterByName').html('Name &#x25B2; &#x25BC;');
        type == 'desc' ? $('#search').attr('data-method-search', 'id-desc') : $('#search').attr('data-method-search', 'id-asc');
        performSearch();
        // console.log(type)
        // console.log(type.type)
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


    $('#tasks').on('click', 'tr', function (event) {
        // Obtener los valores de las celdas de la fila clicada
        if ($(event.target).hasClass('delete') || $(event.target).is(':checkbox')) {
            return;
        }
        let id = $(this).find('td:eq(0)').text(); // Obtener el valor de la primera celda (ID)
        let data = { id: id };

        myModal.toggle();
        $('#sendForm').hide();
        $('#type').prop('disabled', true);
        $('#name').prop('disabled', true);
        $('#description').prop('disabled', true);
        $('#description').css('resize', 'none');

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

    $('#userFeedbackClose').on('click', function () {
        $('#userFeedbackDiv').css('display', 'none');

    })

    $('#showGraficModal').on('click', function () {
        graficModal.toggle();
        //TODO: HACER QUE SE LE LLAME A ESTO CUANDO SE HACE CLICK EN UNA FLECHA
        // let weeks_offset = 1;
        weeksOffSet = 0;
        showGrafic();
    })
    $('#closeGraficModal').on('click', function () {
        graficModal.toggle();
    })
    $('#goAWeekBack').on('click', function () {
        showGrafic(--weeksOffSet);
    })
    $('#goAWeekAhead').on('click', function () {
        showGrafic(++weeksOffSet);
    })



    $('#donedButton').on('click', function () {
        let data = { id: donedId, state: 1 };
        let button = $('button.edit[data-id="' + donedId + '"]');
        let checkbox = $('input[type="checkbox"][id="' + donedId + '"]');
        console.log(checkbox)
        console.log(button)
        button.prop('disabled', true);
        checkbox.prop('disabled', true);
        checkbox.prop('checked', true);

        // console.log(data)

        // console.log(newClass)
        checkbox.closest('tr').removeClass().addClass('table-success');
        // console.log($($(this).attr()))
        confirmDonedModal.toggle();
        $.ajax({
            url: 'task-save.php',
            type: 'POST',
            data: { data },
            success: function (res) {
                // console.log(res)
            }
        })
    })

    function clearNameErrors() {
        $('#nameErrors').css('display', 'none');
        $('#nameErrors').html('')
    }
    function clearDescriptionErrors() {
        $('#descriptionErrors').css('display', 'none');
        $('#descriptionErrors').html('')
    }

    function clearForm() {

        $('#task-form').find('input[type="text"], textarea').val('');
        $('#task-form').attr('data-task-id', '');
        $('#type').find('option:selected').prop('selected', false);
        $('#type').find('option:first').prop('selected', true);
        clearNameErrors();
        clearDescriptionErrors();
    }

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
    function showUserFeedback(message, success) {
        console.log()
        $('#userFeedbackDiv').css('display', 'block');
        $('#userFeedbackText').text(message)

        success ? $('#userFeedbackDiv').addClass('alert-success').removeClass('alert-danger') : $('#userFeedbackDiv').addClass('alert-danger').removeClass('alert-success');
        // success ? $('#userFeedbackDiv').removeClass('alert-danger') : $('#userFeedbackDiv').removeClass('alert-danger');
    }

    function showGrafic(weeks_offset = 0) {
        $.ajax({
            url: 'task-searchDoneTasks.php',
            type: 'POST',
            data: { weeks_offset },
            success: function (res) {
                let data = JSON.parse(res);
                // Se limpia el array para quitar la primera posición vacía
                data.data == undefined ? '' : data.data.shift();

                // console.log(data.data);
                $('#weekSearch').text(obtenerSemana(weeksOffSet));
                // console.log(obtenerSemana(weeksOffSet)); // Semana actual
                const datos = {
                    labels: [
                        "Domingo",
                        "Lunes",
                        "Martes",
                        "Miércoles",
                        "Jueves",
                        "Viernes",
                        "Sábado",
                    ],
                    datasets: [
                        {
                            label: "Tareas Completadas",
                            data: data.data, // Aquí irían los datos reales
                            backgroundColor: "rgba(54, 162, 235, 0.5)", // Color de las barras
                            borderColor: "rgba(54, 162, 235, 1)", // Color del borde de las barras
                            borderWidth: 1,
                        },
                    ],
                };
                // Opciones del gráfico
                const opciones = {
                    scales: {
                        y: {
                            beginAtZero: true,
                        }
                    },
                };
                // Crear el gráfico de barras
                const ctx = document.getElementById("tareasCompletadas").getContext("2d");
                if (grafico) {
                    grafico.destroy();
                }
                grafico = new Chart(ctx, {
                    type: "bar",
                    data: datos,
                    options: opciones,
                });
                toggleGoAWeekAheadButton();
            }
        })
    }

    function toggleGoAWeekAheadButton() {
        if (weeksOffSet < 0) {
            $('#goAWeekAhead').show();
        } else {
            $('#goAWeekAhead').hide();
        }
    }

    function obtenerSemana(numero) {
        // Obtener la fecha actual
        let fechaActual = new Date();
        // Obtener el día de la semana (0: domingo, 1: lunes, ..., 6: sábado)
        let diaSemana = fechaActual.getDay();
        // Obtener el día del mes
        let diaMes = fechaActual.getDate();
        // Obtener el mes (0: enero, 1: febrero, ..., 11: diciembre)
        let mes = fechaActual.getMonth();
        // Obtener el año
        let año = fechaActual.getFullYear();

        // Calcular el primer día de la semana actual (lunes)
        let primerDiaSemana = new Date(año, mes, diaMes - diaSemana + 1);
        // Calcular el último día de la semana actual (domingo)
        let ultimoDiaSemana = new Date(año, mes, diaMes - diaSemana + 7);

        // Ajustar la fecha según el número proporcionado
        primerDiaSemana.setDate(primerDiaSemana.getDate() + (numero * 7));
        ultimoDiaSemana.setDate(ultimoDiaSemana.getDate() + (numero * 7));

        // Obtener el mes y el día del primer y último día de la semana
        let mesInicio = primerDiaSemana.getMonth() + 1;
        let diaInicio = primerDiaSemana.getDate();
        let mesFin = ultimoDiaSemana.getMonth() + 1;
        let diaFin = ultimoDiaSemana.getDate();

        // Formatear la semana en el formato deseado
        let semana = diaInicio + '/' + mesInicio + '-' + diaFin + '/' + mesFin;

        return semana;
    }
})