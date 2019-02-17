function addSection(title, colno, contentgen, genargs) {
    var section_html = `
        <div class="section">
            <h3>` + title + `</h3>
            <div class="ui list">`

    section_html += contentgen(genargs);

    section_html += `
            </div>
        </div>`

    $('#res_col' + colno).append(section_html);
}

function contactsSecGen() {
    var contacts_html = "";
    for(let c of contacts){
        contacts_html += `
            <div class="item bit-spaced f5">
                <i class='` + c.icon + ` icon'></i>
                <div class="content">
                    <a href='` + c.url +`'>` + c.text + `</a>
                </div>
            </div>`;
    }
    return contacts_html;
}

function skillsGen(skilltype) {
    var skill_html = ""
    for(let s of skills[skilltype].value){
        skill_html += `
            <div class="item bit-spaced">
                <i class="angle right icon"></i>
                <div class="content f5"> ` + s + `</div>
            </div>`;
    }
    return skill_html;
}

function responsibilitiesGen(colno) {
    var resp_html = ""
    for(let r of responsibilities){
        resp_html += `
            <div class="item more-spaced">
                <div class="content">
                    <div class="fbold mt4">` + r.of + `</div>
                    <div class="f-5 mt4">` + r.role + `</div>
                    <div class="f-5 fthin mt4">` + r.duration + `</div>
                </div>
            </div>`
    }
    return resp_html;
}

function experiencesGen() {
    var experiences_html = ""
    for(let e of experiences){
        experiences_html += `
            <div class="item spaced">
                <div class="content">
                    <div class="float-container">
                        <div class="f5 fbold float-left">` + e.role + `</div>
                        <div class="fthin float-right">` + e.duration + `</div>
                    </div>
                    <div class="mb8">` + e.firm + `</div>
                    <div class="f-5">` + e.work + `</div>
                </div>
            </div>`
    }
    return experiences_html;
}

function educationGen(colno) {
    var education_html = ""
    for(let e of education){
        education_html += `
            <div class="item">
                <div class="content">
                    <div class="float-container mt2">
                        <div class="fbold float-left">` + e.school + `</div>
                        <div class="fthin float-right">` + e.duration + `</div>
                    </div>
                    <div class="float-container mt-2">
                        <div class="float-left">` + e.degree + `</div>
                        <div class="float-right">` + e.gradetype + ` : ` + e.gradevalue + `</div>
                    </div>
                </div>
            </div>`
    }
    return education_html;
}

function projectsGen(colno) {
    var projects_html = ""
    for(let p of projects){
        first_line = p.name + (("descr" in p)?" – "+p.descr:"");
        second_line = p.for + " – " + p.year;
        third_line = `<a href="http://` + p.link + `">` +  p.link + `</a>`;
        projects_html += `
            <div class="item bit-spaced">
                <div class="content">
                    <div class="fbold">` + first_line + `</div>
                    <div class="f-10 mt4">` + second_line +`</div>
                    <div class="f-10 fthin mt2">` + third_line + `</div>
                </div>
            </div>`
    }
    return projects_html;
}

function achievementsGen(colno) {
    var achiev_html = ""
    for(let a of achievements){
        achiev_html += `
            <div class="item spaced">
                <i class='angle right icon'></i>
                <div class="content">` + a + `</div>
            </div>`;
    }
    return achiev_html;
}

function addColumns() {
    addSection("Contacts", 1, contactsSecGen);
    addSection("Technical Skills", 1, skillsGen, 0);
    addSection("Soft Skills", 1, skillsGen, 1);
    addSection("Responsibilities taken", 1, responsibilitiesGen);

    addSection("Experiences", 2, experiencesGen);
    addSection("Education", 2, educationGen);
    addSection("Projects", 2, projectsGen);
    addSection("Achievements", 2, achievementsGen);
}


$(document).ready(function() {
    addColumns();
    $("#print_btn").click(function(){
        window.print();
    });
});
