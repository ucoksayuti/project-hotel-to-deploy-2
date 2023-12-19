$(function () {
    // Initialize datepicker
    $("#entryDate").datepicker();
    $("#exitDate").datepicker();
});


var ringkasanDiv = document.querySelector('.ringkasan');
var saveBtn = document.querySelector('.save-btn');

function submitReservation() {
    // Get form data
    const entryDate = new Date($("#entryDate").val());
    const exitDate = new Date($("#exitDate").val());
    const numberOfPeople = $("#numberOfPeople").val();
    const roomType = $("#roomType").val();
    const ordererName = $("#ordererName").val();
    const ordererEmail = $("#ordererEmail").val();
    const ordererPhoneNumber = $("#ordererPhoneNumber").val();
    const metodePembayaran = $("#metodePembayaran").val();
    let harga = 0

    let jumlah_hari = (exitDate - entryDate) / (24 * 60 * 60 * 1000)


// tryy


if (roomType == 'Deluxe Room') {
    harga = (2000000 * jumlah_hari).toLocaleString()
}
if (roomType == 'Superior Room') {
    harga = (2500000 * jumlah_hari).toLocaleString()
}
if (roomType == 'Twin Room') {
    harga = (3500000 * jumlah_hari).toLocaleString()
}
if (roomType == 'Double Room') {
    harga = (3800000 * jumlah_hari).toLocaleString()
}
if (roomType == 'Single Room') {
    harga = (1500000 * jumlah_hari).toLocaleString()
}
else {
    harga = (4500000 * jumlah_hari).toLocaleString()
}



    var options = { weekday: 'short', month: 'short', day: 'numeric', year:'numeric' };
    var formattedEntryDate = entryDate.toLocaleDateString('en-US', options);
    var formattedExitDate = exitDate.toLocaleDateString('en-US', options);

    var resultDiv = document.getElementById('result');

    if (entryDate === "" || numberOfPeople === "" || ordererName === "" || ordererEmail === "" || exitDate === "" || roomType === "" || ordererPhoneNumber === "" || metodePembayaran === "") {
        // Tampilkan alert jika ada form yang kosong
        alert("Mohon lengkapi semua field!");
    } else {
        resultDiv.innerHTML = `
    <div class="title">
                        <p>Your Stay</p>
                    </div>
                    <div class="res-content" >
                        <div class="kiri">
                            <div class="fill">
                                <h3>Nama</h3>
                                <p>${ordererName}</p>
                            </div>
                            <div class="fill">
                                <h3>Check In</h3>
                                <p>${formattedEntryDate}</p>
                            </div>
                            <div class="fill">
                                <h3>Room</h3>
                                <p>${roomType}</p>
                            </div>
                        </div>
                        <div class="kanan">
                            <div class="fill">
                                <h3>Email</h3>
                                <p>${ordererEmail}</p>
                            </div>
                            <div class="fill">
                                <h3>Check Out</h3>
                                <p>${formattedExitDate}</p>
                            </div>
                            <div class="fill">
                                <h3>Payment Method</h3>
                                <p>${metodePembayaran}</p>
                            </div>
                        </div>
                    </div>
                    <div class="time">
                        <div class="ket">
                            <p>${formattedEntryDate} - ${formattedExitDate}</p>
                            <p>${numberOfPeople} People</p>
                            <p class="fw fs-5">Total Price: Rp ${harga}
                        </div>
                        <div class="tombol-ajah">
                                                    <div class="save-btn">
                                                        <button class="btn-booknow" onclick="booking()">Book Now</button>
                                                    </div>
                                                    <div class="edit-btn">
                                                        <button class="btn-edit" onclick="edit()">Edit</button>
                                                    </div>
                                                </div>
                    </div>
    `

    
    ringkasanDiv.style.display = 'block';


    
    saveBtn.style.display = 'none';
    }
    
}

function edit() {
    ringkasanDiv.style.display = 'none';

    var editBtn = document.querySelector('.edit-btn');
    editBtn.style.display = 'none';


    saveBtn.style.display = 'block';

    document.documentElement.scrollTop = 0;
}

function booking() {
    const entryDate = new Date($("#entryDate").val());
    const exitDate = new Date($("#exitDate").val());
    const numberOfPeople = $("#numberOfPeople").val();
    const roomType = $("#roomType").val();
    const ordererName = $("#ordererName").val();
    const ordererEmail = $("#ordererEmail").val();
    const ordererPhoneNumber = $("#ordererPhoneNumber").val();
    const metodePembayaran = $("#metodePembayaran").val();
    let harga = 0

    let jumlah_hari = (exitDate - entryDate) / (24 * 60 * 60 * 1000)






    if (roomType == 'standard') {
        harga = 2000 * jumlah_hari
    }
    else {
        harga = 17000 * jumlah_hari
    }


    $.ajax({
        type: "POST",
        url: "/submit_reservation",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
            entryDate,
            exitDate,
            numberOfPeople,
            roomType,
            ordererName,
            ordererEmail,
            ordererPhoneNumber,
            metodePembayaran,
            harga,
            jumlah_hari
        }),
        dataType: "json",
        success: function (response) {
            alert("Reservation successful!");
        },
        error: function (error) {
            alert("Error submitting reservation. Please try again.");
        },
    });

    window.location.href = "/";
}