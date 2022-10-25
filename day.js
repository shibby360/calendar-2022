var query = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})
var ls = localStorage
var monthn = Number(query.m)
var dayn = Number(query.d)
var yearn = Number(query.y)
var date = new Date(yearn, monthn, dayn)
$('#header').text(`${date.toLocaleDateString('en-us', {weekday: 'long'})}, ${date.toLocaleDateString('en-us', {month:'long'})} ${dayn}, ${date.toLocaleDateString('en-us', {year: 'numeric'})}`)
$.fn.setCursorPosition = function(pos) {
  this.each(function(index, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  });
  return this;
};
var coloroptions = $('#colorpicker > option')
for(var i = 0; i < coloroptions.length; i++) {
  coloroptions[i].style.backgroundColor = coloroptions[i].value
}
$('#colorpicker').on('change', function(ev) {
  $('#colorpicker').css('background-color', $('#colorpicker').val())
})
$('#schedule').on('click', function(ev) {
  try {
  var ret = false
  if($('#eventname').val() === '') {
    $('#eventname').css('border', '3px red solid')
    ret = true
  }
  if($('#time').val() === '') {
    $('#time').css('border', '3px red solid')
    ret = true
  }
  if(ret) {
    return
  }
  var events = JSON.parse(ls.getItem('events'))
  if(JSON.stringify(events) === '{}') {
    var id = 0
  } else {
    var id = Number(Object.keys(events).at(-1))+1
  }
  events[id] = {
    name:$('#eventname').val(),
    about:$('#aboutevent').val(),
    time:$('#time').val(),
    color:$('#colorpicker').val(),
    day:dayn,
    month:monthn,
    year:yearn
  }
  ls.setItem('events', JSON.stringify(events))
  $('#eventname').val('')
  $('#eventname').css('border', '')
  $('#aboutevent').val('')
  $('#time').val('')
  $('#time').css('border', '')
  $('#colorpicker').val('secondary')
  update()
  } catch(err) {
  }
})
function update() {
  var events = JSON.parse(ls.getItem('events'))
  $('#events').html('')
  for(var i in events) {
    if(events[i].day !== dayn || events[i].month !== monthn || events[i].year !== yearn) { continue }
    // var el = $('<li>')
    // el.text(`${events[i].name} - ${events[i].time}`)
    // el.css('color', events[i].color)
    function format(time) {
      var hours = Number(time.substring(0, 2))
      var suffix = hours >= 12 ? "PM":"AM"
      return ((hours + 11) % 12 + 1) + time.substring(2) + ' ' + suffix
    }
    var el = `<div class="card text-white bg-${events[i].color} mb-3 ms-2 me-2 col-12 col-lg-3 col-md-6" style="max-width: 18rem;">
  <div class="card-header">${events[i].name} <span class="deletebutton" id="${i}" onclick="deletebuttonclick(this)">❌</span></div>
  <div class="card-body">
    <p class="card-text">${events[i].about}</p>
    <p class="card-text">At ${format(events[i].time)}</p>
  </div>
</div>
    `
    $('#events').append(el)
  }
}
update()
$('#back').on('click', function(ev) {
  var el = $(`<a href="/?m=${monthn}&y=${yearn}" style="display: none" id="rerouter">`)
  $('body').append(el)
  $('a')[0].click()
})
$('#clearname').on('click', function(ev) {
  $('#eventname').val('')
})
$('#clearabout').on('click', function(ev) {
  $('#aboutevent').val('')
})
$('#cleartime').on('click', function(ev) {
  $('#time').val('')
})
function deletebuttonclick(el) {
  if(confirm('Do you want to delete this event?:')) {
    var events = JSON.parse(ls.getItem('events'))
    delete events[el.id]
    ls.setItem('events', JSON.stringify(events))
    update()
  }
}
$('#gameschedule').on('click', function(ev) {
  $('#eventname').val('Game')
  $('#aboutevent').val(' game').focus().setCursorPosition(0)
})
$('#appointschedule').on('click', function(ev) {
  $('#eventname').val('Appointment')
  $('#aboutevent').val('Appointment for ').focus()
})
$('#classschedule').on('click', function(ev) {
  $('#eventname').val('Class')
  $('#aboutevent').val(' class').focus().setCursorPosition(0)
})
