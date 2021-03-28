var key = '24f16cad0b4bc6b35e26c565f7a99e03';

function init(){
    var inputEl = document.getElementById('city-input');
    var searchEl = document.getElementById('search-button');
    var currentHumidityEl = document.getElementById('');
    var currentTempEl = document.getElementById('');
    var currentPhotoEl = document.getElementById('');
    var clearEl = document.getElementById('');
    var historyEl = document.getElementById('');
    var nameEl = document.getElementById('');
    var currentWindEl = document.getElementById('');
    var currentUVEl = document.getElementById('');

    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    console.log(searches);
}