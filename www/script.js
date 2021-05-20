window.onload = initData;

function initData() {

  window.blog = {
    name: "My blog",
    entries: [
      { title: "Mon titre", text: "bla bla", isPublished: true },
      { title: "...", text: "...", isPublished: false }
    ]
  }

}

function addActivity() {

  var x = document.getElementById("activitiesList").childElementCount + 1;



  var _div = document.createElement('div');
  _div.innerHTML = `
    <div class="accordion-item">
    <h2 class="accordion-header" id="heading`+ x + `">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse`+ x + `" aria-expanded="false" aria-controls="collapse` + x + `">
        Activité `+ x + `
      </button>
    </h2>
    <div id="collapse`+ x + `" class="accordion-collapse collapse" aria-labelledby="heading` + x + `" data-bs-parent="#activitiesList">
      <div class="accordion-body">
        <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>
    `;
  //append _div to button
  document.getElementById("activitiesList").appendChild(_div);



}

function setParticipantsCount(selectObject) {
  console.log(selectObject.value);
  console.log(selectObject.id);



  // Get participants list div

  var idActivity = selectObject.id.replace(/\D/g,'');

  var participantsListDiv = document.getElementById("participantsList"+idActivity);
  participantsListDiv.innerHTML = '';

  var i;
  for (i = 0; i < selectObject.value; i++) {

    var crtDiv = document.createElement('div');
    crtDiv.classList.add('col-3');
    crtDiv.classList.add('participantItem');
    crtDiv.innerHTML =
      `

<div class="row">
    <div class="col-6 margeBottom">
        <input type="text" style="width: 100%;" placeholder="Nom*" required>
    </div>
    <div class="col-6 margeBottom">
        <input type="text" style="width: 100%;" placeholder="Prénom*" required>
    </div>
    <div class="col-6 margeBottom">
        <input type="text" style="width: 100%;" placeholder="Date de naissance"
            required>
    </div>
    <div class="col-6 margeBottom">
        <input type="text" style="width: 100%;" placeholder="Taille (cm)*"
            required>
    </div>
    <div class="col-6 margeBottom">
        <input type="text" style="width: 100%;" placeholder="Niveau*" required>
    </div>

</div>

`;

    participantsListDiv.appendChild(crtDiv);

  }


}

function addActivity2() {

  var x = document.getElementById("activitiesList").childElementCount + 1;

  var _div = document.createElement('div');
  _div.innerHTML = `
  <div class="activityItem">

  <div class="row">
      <div class="col-2">
          <div class="row">
              <div class="col-12">
                  <select id="code_activity_`+ x + `" style="width: 100%;">
                      <option value="">Please select an activity</option>
                      <option value="VTTAE_WITH_LOC">VTTTAE AVEC LOC - 1/2 JOURNEE -
                          45€/PERS
                      </option>
                      <option value="VTTAE_WITHOUT_LOC">VTTTAE SANS LOC - 1/2 JOURNEE -
                          30€/PERS
                      </option>
                  </select>
              </div>
          </div>
          <div class="row">
              <div class="col-12">
                  <input type="date" id="date_activity_`+ x + `" name="trip-start"
                      value="2018-07-22" max="2018-12-31" style="width: 100%;">
              </div>
          </div>
          <div class="row">
              <div class="col-12">
                  <select name="ParticipantsCount1" onchange="setParticipantsCount(this)" id="users_activity_`+ x + `" style="width: 100%;">
                      <option value="">Please select an users count</option>
                      <option value="1">01</option>
                      <option value="2">02</option>
                      <option value="3">03</option>
                      <option value="4">04</option>
                      <option value="5">05</option>
                      <option value="6">06</option>
                      <option value="7">07</option>
                      <option value="8">08</option>
                      </option>
                  </select>
              </div>
          </div>
      </div>

      <div class="col-10">
          <div id="participantsList`+ x + `" class="row participantsList">
            <div class="col-3 participantItem`+ x + `1">
              <div class="row">
                  <div class="col-6 margeBottom">
                      <input type="text" style="width: 100%;" placeholder="Nom*" required>
                  </div>
                  <div class="col-6 margeBottom">
                      <input type="text" style="width: 100%;" placeholder="Prénom*" required>
                  </div>
                  <div class="col-6 margeBottom">
                      <input type="text" style="width: 100%;" placeholder="Date de naissance"
                          required>
                  </div>
                  <div class="col-6 margeBottom">
                      <input type="text" style="width: 100%;" placeholder="Taille (cm)*"
                          required>
                  </div>
                  <div class="col-6 margeBottom">
                      <input type="text" style="width: 100%;" placeholder="Niveau*" required>
                  </div>
              </div>
          </div>
          </div>
      </div>
    `;
  //append _div to button
  document.getElementById("activitiesList").appendChild(_div);



}


