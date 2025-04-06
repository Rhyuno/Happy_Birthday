// ------------------------------
// Page 1: Cake and Candle Logic
// ------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const nextButton = document.getElementById("nextButton");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let finished = false; // Prevent further candle additions
  
    function updateCandleCount() {
      const activeCandles = candles.filter(
        (candle) => !candle.classList.contains("out")
      ).length;
      candleCountDisplay.textContent = activeCandles;
      
      // When all candles are blown out, show the "Next" button.
      if (activeCandles === 0 && candles.length > 0 && !finished) {
        finished = true;
        nextButton.style.display = "block";
      }
    }
  
    function addCandle(left, top) {
      if (finished) return;
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = left + "px";
      candle.style.top = top + "px";
  
      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);
  
      cake.appendChild(candle);
      candles.push(candle);
      updateCandleCount();
    }
  
    cake.addEventListener("click", function (event) {
      if (finished) return;
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    });
  
    function isBlowing() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let average = sum / bufferLength;
      return average > 40; // Adjust threshold as needed
    }
  
    function blowOutCandles() {
      let blownOut = 0;
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }
      if (blownOut > 0) {
        updateCandleCount();
      }
    }
  
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          setInterval(blowOutCandles, 200);
        })
        .catch(function (err) {
          console.log("Unable to access microphone: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
    
    // When the "Next" button is clicked, switch from page1 to page2.
    nextButton.addEventListener("click", function(){
      document.getElementById("page1").style.display = "none";
      document.getElementById("page2").style.display = "block";
    });
  });
  
  // ------------------------------
  // Page 2: Envelope and Letter Logic
  // ------------------------------
  $(document).ready(function() {
    var envelope = $('#envelope');
    var letter = $('.letter');
    
    // Toggle envelope open/close on click.
    envelope.click(function() {
      if (envelope.hasClass("open")) {
        envelope.removeClass("open").addClass("close");
      } else {
        envelope.removeClass("close").addClass("open");
      }
    });
    
    // Typing animation function with blinking cursor.
    function typeMessage(text, element, speed, pauseTime) {
      let index = 0;
      element.append('<span id="cursor">|</span>');
      
      function typeChar() {
        if (index < text.length) {
          let char = text.charAt(index);
          element.find('#cursor').remove();
          element.append(char);
          element.append('<span id="cursor">|</span>');
          index++;
          let delay = speed;
          if (char === ".") {
            delay += pauseTime;
          }
          setTimeout(typeChar, delay);
        } else {
          element.find('#cursor').remove();
        }
      }
      typeChar();
    }
    
    // When the letter is clicked, fade in a white overlay and display the message.
     letter.click(function(e) {
      e.stopPropagation(); // Prevent envelope toggle
      if ($('#whiteOverlay').length === 0) {
        $('body').append('<div id="whiteOverlay"></div>');
      }
      $('#whiteOverlay').animate({opacity: 1}, 1000, function() {
        setTimeout(function() {
          if ($('#message').length === 0) {
            $('body').append('<div id="message"></div>');
          }
          var messageText = "Happy Birthday, my love!\n\nEvery moment with you feels like a beautiful dream, and today, on your special day, I want to remind you just how much you mean to me. Your smile brightens even the darkest days, and your love fills my heart with more joy than I ever thought possible. You are beautiful, inside and out, and I feel so incredibly lucky to walk through life with you by my side.\n\nAs you celebrate today, know that I’ll be celebrating you every day for your kindness, your passion, your strength, and the way you make this world (and my world) a better place. I can’t wait for all the amazing memories we’ll create together in the years to come, and no matter what happens, I will always be here to support and love you with everything I have.\n\nI’m so proud of all that you are, and all that you’re becoming. Keep shining, sweetheart, because you’re destined for greatness. You’re my everything, and I promise to keep making you feel loved and cherished.\n\nHappy birthday, my love. Let’s make this year even more magical than the last.\n\nWith all my heart,\nAndrei";
          typeMessage(messageText, $('#message'), 50, 500);
        }, 500);
      });
    });
  });