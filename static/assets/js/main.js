$(document).ready(function () {
    listing();
    bsCustomFileInput.init();
});

function listing() {
    $.ajax({
        type: "GET",
        url: "/admin",
        data: {},
        success: function (response) {
            console.log(response);
            let articles = response["articles"];
            let temp_html = "";

            for (let i = 0; i < articles.length; i++) {
                let Name = articles[i]["Name"];
                let Price = articles[i]["Price"];
                let file = articles[i]["file"];

                temp_html += `
                <div class="col-lg-4 mb-4">
                  <div class="card">
                    <img src="${file}" class="img-room">
                    <div class="content d-flex justify-content-between align-items-end">
                      <div class="desc">
                        <h4 class="fw-bold">${Name}</h4>
                        <div class="text-price">
                        <p class="card-price">Rp ${Price}</p>
                        <p class="card-price-desc">/Night/Room</p>
                        </div>
                        <div class="rating">
                          <i class="fa-solid fa-star text-warning"></i>
                          <i class="fa-solid fa-star text-warning"></i>
                          <i class="fa-solid fa-star text-warning"></i>
                          <i class="fa-solid fa-star text-warning"></i>
                          <i class="fa-solid fa-star text-warning"></i>
                          <p style="font-weight:bold">4,7</p>
                        </div>
                      </div>
                      <div>
                        <a href="/booking" class="btn-booknow">Book Now</a>
                      </div>
                    </div>
                </div>
                `;
            }

            $("#table-body").html(temp_html);
        },
    });
}

$(document).ready(function () {
  get_room_names();
  bsCustomFileInput.init();

  
    // Menanggapi pengiriman formulir
    $("#bookingForm").submit(function (e) {
      e.preventDefault();
  
      // Mengambil data formulir
      var formData = {
        entryDate: $("#date").val(),
        exitDate: $("#date").val(),
        numberOfPeople: $("input[name='numberOfPeople']").val(),
        roomType: $("#room").val(),
        // ... (Tambahkan bidang formulir lainnya)
      };
  
      // Mengirim data melalui AJAX
      $.ajax({
        type: "POST",
        url: "/submit_reservation",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(formData),
        success: function (response) {
          console.log(response);
          // Handle respons sesuai kebutuhan Anda
        },
        error: function (error) {
          console.log(error);
          // Handle error sesuai kebutuhan Anda
        },
      });
    });
});

function get_room_names() {
  $.ajax({
      type: "GET",
      url: "/admin/roomnames",
      data: {},
      success: function (response) {
          console.log(response);
          let room_names = response["room_names"];
          let temp_html = "";

          for (let i = 0; i < room_names.length; i++) {
              let room_name = room_names[i]["Name"];
              temp_html += `<option value="${room_name}">${room_name}</option>`;
          }

          $("#room").html(temp_html);
      },
  });
}






document.addEventListener('DOMContentLoaded', function () {
  const passwordToggleIcons = document.querySelectorAll('.password-toggle-icon');
  passwordToggleIcons.forEach(function (icon) {
    icon.addEventListener('click', function () {
      const passwordField = document.querySelector(this.getAttribute('toggle'));
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      } else {
        passwordField.type = 'password';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      }
    });
  });
});

document.getElementById('bookButton').addEventListener('click', function() {
  // Kirim permintaan ke server untuk memeriksa status login
  fetch('/booking')
      .then(response => {
          if (response.redirected) {
              // Jika server meredirect, arahkan pengguna ke halaman login
              window.location.href = '/signin';
          } else {
              // Jika tidak ada redirect, lanjutkan ke halaman pemesanan
              window.location.href = '/booking';
          }
      })
      .catch(error => console.error('Error:', error));
});


function deleteItem(name) {
  if (confirm('Are you sure you want to delete this contact?')) {
    $.ajax({
      type: 'DELETE',
      url: `/delete-contact/${name}`,
      success: function(response) {
        alert(response.message);
      },
      error: function(error) {
        console.error('Error deleting contact:', error);
      }
    });
  }
}

// $(document).ready(function () {
//   get_list_review();
//   bsCustomFileInput.init();
// });

// function get_list_review() {
//   $.ajax({
//       type: "GET",
//       url: "/contact",
//       data: {},
//       success: function (response) {
//           console.log(response);
//           let contacts = response["contact"];
//           let temp_html = "";

//           for (let i = 0; i < contact.length; i++) {
//               let name = contacts[i]["name"];
//               let email = contacts[i]["email"];
//               let message = contacts[i]["message"];

//               temp_html += `
//               <div class="col-6 Rev-card">
//               <div class="Rev-card-profile">
//                 <img src="../static/assets/img/bed333.avif" alt="" />
//               </div>
//               <div class="Rev-card-text">
//                 <div class="Rev-card-name">
//                   <h5>${name}</h5>
//                   <p>${email}</p>
//                 </div>
//                 <p>
//                   ${message}
//                 </p>
//               </div>
//             </div>
//               `;
//           }

//           $("#review").html(temp_html);
//       },
//   });
// }

// $(document).ready(function () {
//   getreview();
//   bsCustomFileInput.init();
// });

// function getreview() {
//   $.ajax({
//     type: "GET",
//     url: "/contact",
//     data: {},
//     success: function (response) {
//       console.log(response);
//       let 
//     }
//   })
// }


// $(document).ready(function () {
//   // Fungsi untuk mengambil data kontak melalui AJAX
//   function loadContacts() {
//       $.ajax({
//           url: "/contact_data",  // Rute Flask yang akan mengembalikan data kontak
//           method: "GET",
//           success: function (data) {
//               // Panggil fungsi untuk menampilkan data kontak di halaman
//               displayContacts(data);
//           },
//           error: function (error) {
//               console.log("Error fetching contact data:", error);
//           }
//       });
//   }

//   // Fungsi untuk menampilkan data kontak di halaman
//   function displayContacts(contacts) {
//       var contactList = $("#contactList");
//       contactList.empty();  // Kosongkan elemen sebelum menambahkan data baru

//       // Iterasi melalui data kontak dan tambahkan ke elemen
//       contacts.forEach(function (contact) {
//           var contactCard = `
//               <div class="col-6 Rev-card">
//                   <div class="Rev-card-profile">
//                       <img src="../static/assets/img/bed333.avif" alt="" />
//                   </div>
//                   <div class="Rev-card-text">
//                       <div class="Rev-card-name">
//                           <h5>${contact.name}</h5>
//                           <p>${contact.email}</p>
//                       </div>
//                       <p>${contact.message}</p>
//                   </div>
//               </div>
//           `;
//           contactList.append(contactCard);
//       });
//   }

//   // Panggil fungsi untuk mengambil dan menampilkan data kontak saat halaman dimuat
//   loadContacts();
// });
