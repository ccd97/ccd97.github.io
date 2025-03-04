function setDimmer(mode){
    if(mode){
        $('.fullpage').hide();
        $('.page.dimmer').dimmer('show');
    }
    else{
        $('.page.dimmer').dimmer('hide');
        $('.fullpage').show();
    }
}

function addSection(title, colno, contentgen, data, genargs) {
    var section_html = `
        <div class="section">
            <h2>` + title + `</h2>
            <div class="ui list">`

    section_html += contentgen(data, genargs);

    section_html += `
            </div>
        </div>`

    $('#res_col' + colno).append(section_html);
}

function contactsSecGen(contacts) {
    var contacts_html = "";
    for(let c of contacts){
        contacts_html += `
            <div class="item bit-spaced">
                <i class='` + c.icon + ` icon pl2'></i>
                <div class="content">
                    <a href='` + c.url +`' class="txt f10">` + c.text + `</a>
                </div>
            </div>`;
    }
    return contacts_html;
}

function skillsGen(skills) {
    var skill_html = ""
    for(let s of skills){
        skill_html += `
            <div class="item bit-spaced">
                <i class="angle right icon"></i>
                <div class="content txt f10"> ` + s + `</div>
            </div>`;
    }
    return skill_html;
}

function experiencesGen(experiences) {
    var experiences_html = ""
    for(let e of experiences){
        experiences_html += `
            <div class="item more-spaced">
                <div class="content">
                    <div class="float-container">
                        <div class="fbold f20 float-left">` + e.firm + `</div>
                        <div class="fthin f10 float-right">` + e.duration + `</div>
                    </div>
                    <div class="f15 txt">` + e.role + `</div>
                </div>
            </div>`
    }
    return experiences_html;
}

function educationGen(education) {
    var education_html = ""
    for(let e of education){
        education_html += `
            <div class="item">
                <div class="content">
                    <div class="float-container mt2">
                        <div class="fbold f20 float-left">` + e.school + `</div>
                        <div class="fthin f10 float-right">` + e.duration + `</div>
                    </div>
                    <div class="float-container mt2">
                        <div class="float-left txt f10">` + e.degree + `</div>
                        <div class="float-right f10">` + e.grade + `</div>
                    </div>
                </div>
            </div>`
    }
    return education_html;
}

function projectsGen(projects) {
    var projects_html = ""
    for(let p of projects){
        first_line = p.name + '<div class="ui mini basic label ml5">' + p.role + '</div>'
        desc_html = "";
        for(let desc_line of p.description){
            desc_html += `
            <div class="item spaced">
                <i class='angle right icon'></i>
                <div class="content txt f5">` + desc_line + `</div>
            </div>`;
        }
        projects_html += `
            <div class="item">
                <div class="content">
                    <div class="float-container mt4">
                        <div class="fbold f15 float-left">` + first_line + `</div>
                        <div class="fthin f-5 float-right">` + p.duration + `</div>
                    </div>
                </div>
            </div>`
            + desc_html
    }
    return projects_html;
}

function achievementsGen(achievements) {
    var achiev_html = ""
    for(let a of achievements){
        achiev_html += `
            <div class="item spaced">
                <i class='angle right icon'></i>
                <div class="content txt f10">` + a + `</div>
            </div>`;
    }
    return achiev_html;
}

function addColumns(data) {
    addSection("Contacts", 2, contactsSecGen, data.contacts);
    addSection("Skills", 2, skillsGen, data.skills);
    addSection("Achievements", 2, achievementsGen, data.achievements);

    addSection("Experiences", 1, experiencesGen, data.experiences);
    addSection("Projects", 1, projectsGen, data.projects);
    addSection("Education", 1, educationGen, data.education);
}

function addDownloadWIPModal() {
    var modal_html = `
        <div class="ui mini modal downloadwip">
            <div class="header">Download</div>
            <div class="content">
                <div>Download resume is WIP</div>
                <div>For now click Print>'Save as PDF'</div>
            </div>
            <div class="actions">
                <div class="ui approve button">OK</div>
            </div>
        </div>
    `
    $('#modals-conatiner').append(modal_html);
}

function addSeoWords(seo) {
    $('#seo-words').text(String(seo));
}

function addModals() {
    addDownloadWIPModal();
}

function setupMenu() {
    $("#print_btn").click(function(){
        window.print();
    });
    $("#download_btn").click(function(){
        $('.mini.modal.downloadwip').modal('show');
    });
    $("#protfolio_btn").click(function(){
        window.open('https://ccd97.github.io');
    });
}

function prepareData() {
    $.ajax({
        dataType: "json",
        url: "https://api.jsonbin.io/v3/b/67c4a014acd3cb34a8f3b7d5/latest",
        beforeSend: function(request) {
            request.setRequestHeader("X-Access-Key", '$2a$10$IGIa3eWQp2.rF8i6nTNHwOCfkSRo3sGoe8U.J0XSiGLhHLH5rojl2');
        },
    }).done(function(json) {
        preparePage(json.record);
    }).fail(function() {
        $.getJSON('data/fallback_resume_data.json', function (json) {
            preparePage(json);
        });
    });
}

function preparePage(data) {
    addColumns(data);
    addSeoWords(data.seo);
    addModals();
    setupMenu();
    setDimmer(false);
}

$(document).ready(function() {
    setDimmer(true);
    prepareData();
});
