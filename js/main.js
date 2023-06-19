const cardsContainer = document.getElementById("cards-container");

const showMsg = status => {
  if(status === "LOADING"){
    cardsContainer.innerHTML = `
    <div class="d-flex justify-content-center">
      <img src="img/loading-with-txt.gif" alt="Loading Spinner.......">
    </div>
      `
  }else if(status === 'NETWORK_ERROR'){
    cardsContainer.innerHTML = `
    <div id="error-message-container">
      <h4 class="text-danger text-center">Pleaase check your internet connection!</h4>
    </div>
      `;
  }else if(status === 'SUCCESS'){
    cardsContainer.innerHTML = "";
  }
}

const loadToolsApi = async () => {
  const API_URL = `https://openapi.programming-hero.com/api/ai/tools`;
  try {
    showMsg('LOADING')
    const data = await (await fetch(API_URL)).json();
    const tools = data.data.tools;
    showMsg('SUCCESS')
    displayTool(tools);
  } catch (error) {
    console.log(error);
    showMsg('NETWORK_ERROR')
  }
};

const getToolDetailsApi = async id => {
  const API_URL = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
  try {
  const data = await (await fetch(API_URL)).json();
  const toolObject = data.data;
  displayToolDetails(toolObject);
  } catch (error) {

  }
}

//Sort by date
let allTools = null;
let sortableArr = [];
const sortByDateBtn = document.getElementById("sort-by-date");
const seeMoreBtn = document.getElementById("see-more-btn");
sortByDateBtn.addEventListener("click", function () {
  cardsContainer.innerHTML = "";
  sortableArr.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));
  console.log(sortableArr);
  displayTool(sortableArr, "sort");
});

const getLitimedTools = () => {
  if (allTools.length > 3) {
    let sixTools = allTools.slice(0, 3);
    allTools = allTools.slice(3);
    seeMoreBtn.classList.remove("d-none");
    sortableArr = sortableArr.concat(sixTools)
    console.log('Sortable Array==>', sortableArr)
    return sixTools;
  }
  seeMoreBtn.classList.add("d-none");
  sortableArr = sortableArr.concat(allTools)
  console.log('Sortable Array==>', sortableArr)
  return allTools;
};

seeMoreBtn.addEventListener("click", function () {
  displayTool(allTools);
});






//Display tool detals 
const modalBody = document.getElementById("modal-body");
const displayToolDetails = tool =>{
  const {description, pricing, features, integrations, input_output_examples, image_link, accuracy
  } = tool;
  const accuracyEelem = `<p class="bg-danger p-1 accuracy">${accuracy.score+'% accuracy'}</p>`
  console.log(tool);

  modalBody.innerHTML = `
  <div
  class="cards-holder d-flex flex-wrap justify-content-center align-items-center gap-3"
>
  <div class="modal-card card" style="max-width: 23rem">
    <div class="card-body">
      <div>
        <b>${description}</b>
      </div>

      <div class="d-flex justify-content-around mt-3 gap-2">
        <b style="color: #03a30a; width:90px"
          >${pricing[0].price}
          ${pricing[0].plan}</b>

        <b style="color: #f28927; width:90px"
          >${pricing[1].price}
          ${pricing[1].plan}</b>

        <b style="color: #eb5757; width:90px"
          >${pricing[2].price}
          ${pricing[2].plan}</b>
      </div>

      <div class="d-flex mt-3 gap-1 flex-wrap">
        <div>
          <h5>Features</h5>
          <ul style="width: 160px">
            <li>${features['1'].feature_name || "No Feature Found!"}</li>
            <li>${features['2'].feature_name || "No Feature Found!"}</li>
            <li>${features['3'].feature_name || "No Feature Found!"}</li>
          </ul>
        </div>
        <div>
          <h5>Integrations</h5>
          <ul style="width: 160px">
            ${integrations.map(socialNetwork => `<li>${socialNetwork || "Not Found!"}</li>`)}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal-card-right card text-center"
    style="max-width: 23rem"
  >
    <div class="card-body">
      <div class="modal-image-container">
      <p class="bg-danger accuracy">${accuracy.score?accuracy.score+'% accuracy':''}</p>
      <img width="100%" src="${image_link[0]}" alt="This is a thumbnail image" />
      </div>
      <h6>
        ${input_output_examples[0].input}
      </h6>
      <p>
      ${input_output_examples[0].output || "No not yet! Take a break"}
      </p>
    </div>
  </div>
</div>
  `;
}


const dateFormater = date => {
  let day = new Date(date).getDate();
  let month = new Date(date).getMonth() + 1;
  let year = new Date(date).getFullYear();
  console.log(day, month, year)
}


//Display tools to UI
const displayTool = (tools, status) => {
  if(!status){
    allTools = tools;
    tools = getLitimedTools()
  }

  tools.forEach((tool) => {
    const { image, features, name, published_in, id } = tool;
    dateFormater(published_in)
    cardsContainer.innerHTML += `
    <div class="col-lg-4 col-md-6 col-sm-12 my-3">
    <div class="card h-100 p-2">
      <img src=${image} class="card-img-top rounded-3" alt="Thumbnail Image">
      <div class="card-body">
        <h5 class="card-title">Features</h5>
        <p class="card-text">
          <ol style="padding-left: 15px; margin: 0">
              ${features.map((feature) => {
                return ` <li>${feature}</li>`;
              })}
          </ol>
        </p>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center">
        <small class="text-muted">
          <h6 style="color: #000; font-weight: bolder; margin: 0; padding: 0">${name}</h6>
          <span><i class="fa-regular fa-calendar-days"></i></span>
          <span>${published_in}</span>
        </small>
        <span onclick = "getToolDetailsApi('${id}')" data-bs-toggle="modal" data-bs-target="#detailAi" style="cursor:pointer; font-size: 1.5rem"><i class="fa-solid fa-arrow-right-long" style="color: #b805057a"></i></span>
      </div>
    </div>
  </div>
    `;
  });
};
loadToolsApi();
