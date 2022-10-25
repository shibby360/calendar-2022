var query = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})
var ls = localStorage
if(ls.getItem('events') === null) {
  ls.setItem('events', '{}')
}
var bootstraptocolors = {
  'primary':'#007BFF',
  'secondary':'#6C757D',
  'success':'#28A745',
  'danger':'#DC3545',
  'warning':'#FFC107',
  'info':'#17A2B8'
}
var date = new Date()
function write(month, year) {
  var date = new Date()
  var realdate = new Date()
  var day = date.getDate()
  date.setDate(3)
  date.setMonth(month)
  date.setFullYear(year)
  var monthname = date.toLocaleString('en-us', {month: 'long'})
  var year = date.getFullYear()
  function daysInMonth() {
    return new Date(year, month+1, 0).getDate()
  }
  function extras() {
    var day = new Date(`${year}-${month+1}`).getDay()+1
    return day
  }
  $('#header').text(`${monthname} ${year}`)
  $('#monthchart').html(`<thead>
      <tr>
        <th class="daynames">Sun</th>
        <th class="daynames">Mon</th>
        <th class="daynames">Tues</th>
        <th class="daynames">Wed</th>
        <th class="daynames">Thurs</th>
        <th class="daynames">Fri</th>
        <th class="daynames">Sat</th>
      </tr>
    </thead>
    <tbody>
      <tr id='row1'></tr>
      <tr id='row2'></tr>
      <tr id='row3'></tr>
      <tr id="row4"></tr>
      <tr id="row5"></tr>
      <tr id="row6"></tr>
    </tbody>`)
  var row = 1
  var count = 0
  for(var i = 1; i <= extras(); i++) {
    var el = $('<td>')
    el.attr('class', 'daynums empty')
    $(`#row${row}`).append(el)
    count += 1
    if(count === 7) {
      count = 0
      row += 1
    }
  }
  for(var i = 1; i <= daysInMonth(); i++) {
    var el = $('<td>')
    el.text(i)
    el.attr('class', 'daynums')
    if(i === day && month === realdate.getMonth() && year === realdate.getFullYear()) {
      el.css('border', '3px black solid')
      el.css('color', 'white')
    }
    var events = JSON.parse(localStorage.getItem('events'))
    var toadd = '<br>'
    for(var j in events) {
      if(events[j].day === i && events[j].month === month && events[j].year === year) {
        toadd += `<span style="color: ${bootstraptocolors[events[j].color]};">●</span>`
      }
    }
    el.html(`${el.html()}${toadd}`)
    $(`#row${row}`).append(el)
    count += 1
    if(count === 7) {
      count = 0
      row += 1
    }
  }
  $('.daynums:not(.empty)').on('click', function(ev) {
    var el = $(`<a href="/day.html?y=${year}&d=${ev.target.innerText.replace(/\D/g, "")}&m=${date.getMonth()}" style="display: none" id="rerouter">`)
    $('body').append(el)
    $('a')[0].click()
  })
  $('p').css('display', 'none')
}
var currmonth = date.getMonth()
if('m' in query) {
  currmonth = query.m
}
var curryear = date.getFullYear()
if('y' in query) {
  currmonth = query.y
}
write(currmonth, curryear)
$(window).on('keydown', function(ev) {
  if(ev.key === 'ArrowRight') {
    currmonth += 1
  } else if(ev.key === 'ArrowLeft') {
    currmonth -= 1
  }
  if(currmonth > 11) {
    currmonth = 0
    curryear += 1
  } else if(currmonth < 0) {
    currmonth = 11
    curryear -= 1
  }
  write(currmonth, curryear)
})
$('#premonth').on('click', function(ev) {
  currmonth -= 1
  if(currmonth < 0) {
    currmonth = 11
    curryear -= 1
  }
  write(currmonth, curryear)
})
$('#nextmonth').on('click', function(ev) {
  currmonth += 1
  if(currmonth > 11) {
    currmonth = 0
    curryear += 1
  }
  write(currmonth, curryear)
})
