const elementPosition = $("#fixed").offset();

$(window).scroll(function () {
  if ($(window).scrollTop() > elementPosition.top) {
    $("#fixed").css("position", "sticky").css("top", "0");
  } else {
    $("#fixed").css("position", "static");
  }
});

$("#homeSearchCats").click(() => {
  const cat = $("#category").val();
  const area = $("#areaName").val();
  window.location.href = `/${cat}/${area}`;
});

$("#searchHotels").click(function () {
  const checkIn = $("#start-date-1").val();
  const checkOut = $("#end-date-1").val();
  const area = $("#area").val();
  const adults = $("#adults").val();
  const children = $("#children").val();

  if(checkIn == '' || checkOut == '' || area == '' || adults == false){
    document.getElementById('error').style.display = 'block';
  }else{
    window.location.href = `/Hotels/availableHotels/?checkIn=${checkIn}&checkOut=${checkOut}&area=${area}&adults=${adults}&children=${children}`;
  }

});

$("#searchAppartments").click(function () {
  const checkIn = $("#start-date-1").val();
  const checkOut = $("#end-date-1").val();
  const area = $("#area").val();
  const adults = $("#adults").val();
  const children = $("#children").val();

  if(checkIn == '' || checkOut == '' || area == '' || adults == false){
    document.getElementById('error').style.display = 'block';
  }else{
    window.location.href = `/Appartments/availableAppartments/?checkIn=${checkIn}&checkOut=${checkOut}&area=${area}&adults=${adults}&children=${children}`;
  }

});


$("#searchVehicles").click(function () {
  const checkin = $('#start-date-1').val();
  const checkout = $('#end-date-1').val()
  const pickup = $("#pickup").val();
  const dropOff = $("#dropOff").val();
  const adults = $("#adultsForVehicle").val();
  const children = $("#childrenForVehicle").val();

  if(checkin == '' || checkout =='' || pickup == '' || dropOff == '' || adults == '' || children == ''){
    document.getElementById('error').style.display = 'block';
  }else{
    window.location.href = `/Vehicles/availableVehicles?checkIn=${checkin}&checkOut=${checkout}&pickup=${pickup}&dropOff=${dropOff}&adults=${adults}&children=${children}`;
  }

  
});


$("#appartmentBooking").click(function () {
  const appartmentId = $("#appartmentId").val();
  const checkIn = $("#start-date-1").val();
  const checkOut = $("#end-date-1").val();
  const adults = $("#adults").val();
  const children = $("#childs").val();
  window.location.href = `/Appartments/booking/payment?appartmentId=${appartmentId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&routePath=/Appartments/apartmentBooking/`;
});

$("#vehicleBooking").click(function () {
  const vehicleId = $("#vehicleId").val();
  const checkIn = $("#start-date-1").val();
  const checkOut = $("#end-date-1").val();
  const location = $("#location").val();
  const adults = $("#adults").val();
  const children = $("#childs").val();
  window.location.href = `/Vehicles/booking?vehicleId=${vehicleId}&checkIn=${checkIn}&checkOut=${checkOut}&location=${location}&adults=${adults}&children=${children}&routePath=/Vehicles/vehicleBooking/`;
});

$("#tourEnrolling").click(function () {
  const tourId = $("#tourId").val();
  const seats = $("#seats").val();

  window.location.href = `/Tours/enrolling?tourId=${tourId}&seats=${seats}&routePath=/Tours/booking/`;
});

$("#send").click(function () {
  const name = $("#name").val();
  const email = $("#email").val();
  const message = $("#message").val();
  const data = JSON.stringify({
    name: name,
    email: email,
    message: message,
  });
  fetch("/Contact/feedback", {
    method: "POST",
    body: data,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    // Checking Status
    .then((response) => {
      if (response.status === 200) {
        $("#name").val("");
        $("#email").val("");
        $("#message").val("");
        alert("your message sent successfully.");
      } else {
        alert("oop's something went wrong, Please Try again");
      }
    });
});

$("#subscribe").click(function () {
  const email = $("#subscriptionEmail").val();
  const data = JSON.stringify({
    email: email,
  });
  fetch("/User/subscribe", {
    method: "POST",
    body: data,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    // Checking Status
    .then((response) => {
      if (response.status === 200) {
        $("#subscriptionEmail").val("");
        alert("Thanks for your Subscription");
      } else {
        alert("oop's something went wrong, Please Try again");
      }
    });
});
