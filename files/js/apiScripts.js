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

  window.location.href = `/Hotels/availableHotels/?checkIn=${checkIn}&checkOut=${checkOut}&area=${area}&adults=${adults}`;
});

$("#searchAppartments").click(function () {
  const checkIn = $("#start-date-1").val();
  const checkOut = $("#end-date-1").val();
  const area = $("#area").val();
  const adults = $("#adults").val();

  window.location.href = `/Appartments/availableAppartments/?checkIn=${checkIn}&checkOut=${checkOut}&area=${area}&adults=${adults}`;
});

$("#searchVehicles").click(function () {
  const area = $("#area").val();
  const adults = $("#adultsForVehicle").val();
  const children = $("#childrenForVehicle").val();

  window.location.href = `/Vehicles/availableVehicles?area=${area}&adults=${adults}&children=${children}`;
});

function roomFilter() {
  const hotelId = $("#roomFilterhotelId").val();
  const checkIn = $("#fromDate").val();
  const checkOut = $("#toDate").val();
  const adults = $("#roomAdults").val();
  const children = $("#children").val();
  const priceRange = $("#priceRange").val();
  const hotWater = $("#hotWater").is(":checked");
  const heater = $("#heater").is(":checked");
  const kingBeds = $("#kingBeds").is(":checked");
  const balcony = $("#balcony").is(":checked");
  const parking = $("#parking").is(":checked");
  const roomService = $("#roomService").is(":checked");
  window.location.href = `/Hotels/roomFilter?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&priceRange=${priceRange}&hotWater=${hotWater}&heater=${heater}&kingBeds=${kingBeds}&balcony=${balcony}&parking=${parking}&roomService=${roomService}&hotelId=${hotelId}`;
}

const previousCheckIn = $("#fromDate").val();
const previousCheckOut = $("#toDate").val();
$("#fromDate").change(() => {
  const currentCheckIn = $("#fromDate").val();
  if (currentCheckIn != previousCheckIn) {
    roomFilter();
  }
});
$("#toDate").change(() => {
  const currentCheckOut = $("#toDate").val();
  if (currentCheckOut != previousCheckOut) {
    roomFilter();
  }
});

$("#roomAdults").change(() => {
  roomFilter();
});
$("#children").change(() => {
  roomFilter();
});
$("#priceRange").change(() => {
  roomFilter();
});
$("#hotWater").change(() => {
  roomFilter();
});
$("#heater").change(() => {
  roomFilter();
});
$("#kingBeds").change(() => {
  roomFilter();
});
$("#balcony").change(() => {
  roomFilter();
});
$("#parking").change(() => {
  roomFilter();
});
$("#roomService").change(() => {
  roomFilter();
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
