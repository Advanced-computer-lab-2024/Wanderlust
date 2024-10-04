function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;

    sidebar.classList.toggle("collapsed");
    body.classList.toggle("sidebar-collapsed");
}
function switchForm(form) {
    const signUpTouristForm = document.getElementById("sign-up-tourist-form");
    const signUpWorkerForm = document.getElementById("sign-up-worker-form");
    const signUpTouristTab = document.getElementById("sign-up-tourist-tab");
    const signUpWorkerTab = document.getElementById("sign-up-worker-tab");

    signUpTouristForm.style.display = "none";
    signUpWorkerForm.style.display = "none";
    signUpTouristTab.classList.remove("active");
    signUpWorkerTab.classList.remove("active");

    if (form === "sign_up_tourist") {
        signUpTouristForm.style.display = "block";
        signUpTouristTab.classList.add("active");
    } else {
        signUpWorkerForm.style.display = "block";
        signUpWorkerTab.classList.add("active");
    }
}
function toggleJobField() {
    const occupation = document.getElementById("occupation").value;
    const jobField = document.getElementById("job-field");

    if (occupation === "Job") {
        jobField.style.display = "block";
        jobField.querySelector("input").required = true;
    } else {
        jobField.style.display = "none";
        jobField.querySelector("input").required = false;
    }
}
function displayEditForm() {
    editForm = document.getElementById("edit-account-form");
    editForm.style.display = "block";
}
function cancelEditProfile() {
    window.location.reload();
}
document.addEventListener("DOMContentLoaded", () => {
    editAccBtn = document.getElementById("editAccBtn");
    cancelEditBtn = document.getElementById("cancelEditBtn");
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", cancelEditProfile);
    }
    if (editAccBtn) {
        editAccBtn.addEventListener("click", displayEditForm);
    }
});
