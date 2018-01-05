const mainContainer = $('#main-container');
const chooseBankContainer = $('#choose-bank-container');

const createFeedback = (questionText, recordedText, article) => {
  // Create feedback
  let feedbackContainer = $('<div>', {
    class: 'row flex-center',
    id: 'feedback-container'
  });
  let card = $('<div>', { class: 'feedback-card' });

  let question = $('<h1>');
  question.text(questionText);
  let chart = $('<canvas>', {
    id: 'feedback-chart',
    width: '800',
    height: '400'
  });

  card.append(question);
  card.append(chart);
  card.append(article);

  let nextContainer = $('<div>', { class: 'col-md-12 flex-center' });
  let next = $('<span>', {
    class: 'fa fa-arrow-circle-right fa-5x',
    id: 'next'
  });

  nextContainer.append(next);

  feedbackContainer.append(card);
  feedbackContainer.append(nextContainer);

  $('#record-response-container').remove();
  mainContainer.append(feedbackContainer);

  // Calculate API
  console.log(recordedText);
  axios
    .post('/api/tone-analyzer', {
      username: '8be17060-7d16-4dde-b8db-2f789916806c',
      password: 'pxQuQ0lbWszM',
      text: recordedText
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });

  // Build chart
  Chart.defaults.global.defaultFontColor = 'white';
  var ctx = document.getElementById('feedback-chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Anger',
        'Fear',
        'Joy',
        'Sadness',
        'Analytical',
        'Confident',
        'Tentative'
      ],
      datasets: [
        {
          label: 'Feedback',
          data: [0.4, 0.3, 0.7, 0.1, 0.4, 0.9, 0.5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)'
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      responsive: false,
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 20
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              max: 1,
              fontSize: 20,
              min: 0
            }
          }
        ]
      }
    }
  });
};

const createTimer = question => {
  let recordResponseContainer = $('<div>', {
    class: 'row flex-center',
    id: 'record-response-container'
  });

  let timer = $('<div>', { class: 'col-md-12', id: 'timer' });
  timer.text('1:00');

  let qContainer = $('<div>', { class: 'col-md-12', id: 'question' });
  let text = $('<textarea>', { id: 'recorded-text', disabled: 'disabled' });
  let q = $('<h1>');
  q.text(question);

  qContainer.append(text);
  qContainer.append(q);

  let bContainer = $('<div>', { class: 'col-md-12', id: 'control-buttons' });
  let startButton = $('<div>', { class: 'btn mt-0', id: 'start' });
  let icon = $('<span>', { class: 'fa fa-play-circle fa-3x' });
  startButton.append(icon);
  bContainer.append(startButton);

  recordResponseContainer.append(timer);
  recordResponseContainer.append(qContainer);
  recordResponseContainer.append(bContainer);

  chooseBankContainer.remove();
  mainContainer.append(recordResponseContainer);

  responsiveVoice.speak(question);
};

// Global questions
let Questions = [];
let index = 0;

// Timer
let timer = $('#timer');

let recordInterval = null;

const startTimer = mediaRecorder => {
  let count = 60;

  recordInterval = setInterval(function() {
    count -= 1;
    let seconds = count;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    $('#timer').text(`00:${seconds}`);
    console.log(count);
    if (count === -1) {
      clearInterval(recordInterval);
      let questionText = Questions[index];

      let recordedText = $('#recorded-text').val();

      mediaRecorder.stop();

      createFeedback(questionText, recordedText);

      $('#record-response-container').remove();

      // Record recognition
    }
  }, 1000);
};

// Chooses a question bank ( on click )
$('.question-bank-card').click(function(e) {
  const bankId = $(this).data('id');

  axios
    .get(`/users/bank=${bankId}`)
    .then(response => {
      console.log(response);
      // Shuffle bank's questions
      Questions = response.data.questions;

      // Shuffles array
      Questions.sort((prev, curr) => {
        const positive = Math.random();
        const negative = Math.random() * -1;
        return positive + negative;
      });
      console.log(Questions);
      $('#content-title').html(
        "Record Your Response <span class='fa fa-battery-2'></span>"
      );
      index = 0;
      createTimer(Questions[index]);
    })
    .catch(err => console.log(err));
});

// HANDLE RECORDING with getUserMedia

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');
  navigator.mediaDevices
    .getUserMedia(
      // constraints - only audio needed for this app
      {
        audio: true
      }
    )
    .then(function(stream) {
      // Success callback
      let mediaRecorder = new MediaRecorder(stream);

      let chunks = [];

      // Checks when data is available (when you speak in the mic)
      mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = e => {
        let questionText = Questions[index];
        let recordedText = $('#recorded-text').val();

        // Create dummy feedback to get UserId + ID
        axios
          .post('/action/feedback', {
            question: 'Dummy Question'
          })
          .then(response => {
            console.log(response);

            let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            chunks = [];
            let audioURL = window.URL.createObjectURL(blob);

            let clipName = `${response.data.UserId}-${response.data.id}`;

            var clipContainer = document.createElement('article');
            var audio = document.createElement('audio');

            clipContainer.classList.add('clip');
            clipContainer.classList.add('flex-center');
            audio.setAttribute('controls', '');

            clipContainer.appendChild(audio);

            audio.src = audioURL;

            console.log(blob);
            console.log(audioURL);

            createFeedback(questionText, recordedText, clipContainer);

            $('#record-response-container').remove();
          })
          .catch(err => console.log(err));

        // Stop media recording
        console.log(mediaRecorder.state);
        console.log('Recording has stopped.');
      };

      // Start Timer (change to event delegation)
      mainContainer.on('click', '#start', function(e) {
        startTimer(mediaRecorder);

        let rContainer = $('<div>', { class: 'btn mt-2', id: 'stop' });
        let removeButton = $('<span>', {
          class: 'fa fa-stop-circle fa-3x'
        });
        rContainer.append(removeButton);
        $(this).replaceWith(rContainer);

        // Starts media recording
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log('Recording audio...');
      });

      // Stop Timer (change to event delegation)
      mainContainer.on('click', '#stop', function(e) {
        clearInterval(recordInterval);
        mediaRecorder.stop();
      });
    })
    // Error callback
    .catch(function(err) {
      console.log('The following gUM error occured: ' + err);
    });
} else {
  console.log('getUserMedia not supported on your browser!');
}

// Next Question
mainContainer.on('click', '#next', function(e) {
  $('#feedback-container').remove();
  index++;
  if (index >= Questions.length) {
    console.log('Went through all the questions');
  } else {
    console.log('next');
    createTimer(Questions[index]);
  }
});
