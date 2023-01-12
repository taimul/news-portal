const loadCatagory = async () => {
    const url = `https://openapi.programming-hero.com/api/news/categories`
    const res = await fetch(url);
    const data = await res.json();
    displayCategory(data.data.news_category);
}

const displayCategory = categories => {
    const newsCategories = document.getElementById('catagories');
    categories.forEach(category => {
        // console.log(category);
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.innerHTML = `
        <a onclick="categoryDetails('${category.category_id}' ,'${category.category_name}')" class="nav-link" href="#">${category.category_name}</a>
        `;
        newsCategories.appendChild(li);
    });
}

// spinner method
const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('d-none');
    } else {
        loaderSection.classList.add('d-none');
    }
}

const categoryDetails = async (id, name) => {
    toggleSpinner(true);
    const url = `https://openapi.programming-hero.com/api/news/category/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    const header = document.getElementById('details-container')
    header.innerText = `${data.data.length} item found for category ${name}`;
    categoryMoreinfo(data.data);
}

const categoryMoreinfo = moreInfo => {
    const newsInfo = document.getElementById('news-container');
    newsInfo.innerHTML = '';

    //  sort by views

    let sortByView = moreInfo.sort(function (a, b) {
        return (b.total_view - a.total_view);
    })

    // no news found alert
    const noNews = document.getElementById('message-container');
    if (moreInfo.length === 0) {
        noNews.classList.remove('d-none');
    } else {
        noNews.classList.add('d-none');
    }

    sortByView.forEach(info => {
        const cardShow = document.createElement('div');
        cardShow.classList.add('card', 'mt-3', 'p-3');
        cardShow.innerHTML = `
        <div class="row g-0">
                <div class="col-md-3">
                    <img src="${info.thumbnail_url}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${info.title}</h5>
                        <p class="card-text">${info.details}</p>
                        <div class="d-flex justify-content-between" style="align-items:end;">
                            <div class="d-flex">
                                <div>
                                    <img src="${info.author.img}" style="width: 32px; height:32px; border-radius:17px;"
                                        alt="">
                                </div>
                                <div class="font-fix">
                                    <h2>${info.author.name ? info.author.name : 'No Name found'}</h2>
                                    <p>${info.author.published_date ? info.author.published_date : 'no date'}</p>
                                </div>
                            </div>
                            <p><i class="fa-regular fa-eye"></i> <span style="font:caption;">${info.total_view ? info.total_view : 'No Views'}</span></p>
                            <button onclick = "loadnewsDetails('${info._id}')" id="btn-clicked" type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#showDetailsModal">More Details</button>
                        </div>
                    </div>

                </div>
            </div>
        `;
        newsInfo.appendChild(cardShow);
    });
    toggleSpinner(false)
}

const loadnewsDetails = async (news_id) => {
    const url = `https://openapi.programming-hero.com/api/news/${news_id}`;
    const res = await fetch(url);
    const data = await res.json();
    newsDetails(data);
}

const newsDetails = (details) => {
    const getInfo = document.getElementById('showDetailsModalLabel')
    getInfo.innerText = details.data[0].title;
    const paragraph = document.getElementById('modal-paragraph');
    paragraph.innerText = details.data[0].details;
    const nameOfAuthor = document.getElementById('author-name');
    nameOfAuthor.innerHTML = `
     <p>Posted by ${details.data[0].author.name ? details.data[0].author.name : 'no name'}</p>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

    `;
}

// loadnewsDetails()

loadCatagory()

