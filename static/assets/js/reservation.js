// $(function () {
//     // Initialize datepicker
//     $("#entryDate").datepicker();
//     $("#exitDate").datepicker();
// });

// function submitReservation() {
//     // Get form data
//     const entryDate = new Date($("#entryDate").val());
//     const exitDate = new Date($("#exitDate").val());
//     const numberOfPeople = $("#numberOfPeople").val();
//     const roomType = $("#roomType").val();
//     const ordererName = $("#ordererName").val();
//     const ordererEmail = $("#ordererEmail").val();
//     const ordererPhoneNumber = $("#ordererPhoneNumber").val();
//     const metodePembayaran = $("#metodePembayaran").val();
//     let harga = 0

//     let jumlah_hari = (exitDate - entryDate) / (24 * 60 * 60 * 1000)

//     // tryy

//     if (roomType == 'standard') {
//         harga = 2000 * jumlah_hari
//     }
//     else {
//         harga = 17000 * jumlah_hari
//     }

//     var resultDiv = document.getElementById('data-reservasi');
//     resultDiv.innerHTML = `
//     <tbody>
//       <tr>
//         <td>1</td>
//         <td>${ordererName}</td>
//         <td>${ordererEmail}</td>
//         <td>${numberOfPeople}</td>
//         <td>${roomType}</td>
//         <td>${entryDate}</td>
//         <td>${exitDate}</td>
//         <td>
//           <button onclick="deleteItem('{{ contact.name }}')" class="btn btn-danger">
//             <img class="actionIcon" src="../static/assets/img/delete.png" alt="">
//           </button>
//         </td>
//       </tr>
//     </tbody>
//     `
// }

function deleteItem(name) {
    $.ajax({
      url: '/delete-reservation/' + encodeURIComponent(name),
      method: 'DELETE',
      success: function (response) {
        console.log(response.message);
      },
      error: function (error) {
        console.error(error.responseJSON.message);
      }
    });
  }
