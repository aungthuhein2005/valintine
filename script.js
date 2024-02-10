const user_id = localStorage.getItem("id");
if (user_id === null) window.location.href = "index.html";

const check = document.getElementById("check");
const give = document.getElementById("give");
const modal = document.getElementById("modal");
const itemList = document.getElementById("item-list");
const mainDiv = document.getElementById("main");

const click = (link) => {
    if (user_id !== "") {
        const div = document.createElement("div");
        div.className =
            "absolute top-5 right-1/2 border border-red-500 p-3 bg-white rounded z-50";
        div.style = "transform:  translateX(50%);";
        div.innerHTML = `<a href="${link}">Check to social</a>`;
        mainDiv.appendChild(div);
        setTimeout(() => {
            mainDiv.removeChild(div);
        }, 5000);
    } else {
        window.location.href = "index.html";
    }
};

const giveChoco = async (id) => {
    if (user_id !== "") {
        const fetchData = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
            method: "GET",
            headers: {
                "X-Master-Key":
                    "$2a$10$Qud2bXwUn9OkErPqUZ9sxOgkEOxDr5nGrk4ybLJyC1YwnavK4c5O2",
            },
            mode: 'cors',
            
        });

        const response = await fetchData.json();
        const { chocolate, name, image, phone, password, socialLink } =
            response.record;

        let chocoCount = chocolate + 1;

        const updateData = {
            name,
            phone,
            password,
            image,
            chocolate: chocoCount,
            socialLink,
        };

        fetch(`https://api.jsonbin.io/v3/b/${id}`, {
            method: "PUT",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key":
                    "$2a$10$Qud2bXwUn9OkErPqUZ9sxOgkEOxDr5nGrk4ybLJyC1YwnavK4c5O2",
            },
            body: JSON.stringify(updateData),
        });
    } else {
        window.location.href = "index.html";
    }
};

itemList.innerHTML = `<div class='flex space-x-2 justify-center items-cente'>
<span class='sr-only'>Loading...</span>
 <div class=' text-red-600 animate-bounce [animation-delay:-0.3s]'><img src="./image/favicon-16x16.png" width="15px" height="15xpx" alt=""></div>
<div class=' text-red-600 animate-bounce [animation-delay:-0.15s]'><img src="./image/favicon-16x16.png" width="15px" height="15xpx" alt=""></div>
<div class=' text-red-600 animate-bounce'><img src="./image/favicon-16x16.png" width="15px" height="15xpx" alt=""></div>
</div>`;
fetch("https://api.jsonbin.io/v3/c/65c513621f5677401f2cb475/bins/", {
    method: "GET",
    headers: {
        "X-Master-Key":
            "$2a$10$Qud2bXwUn9OkErPqUZ9sxOgkEOxDr5nGrk4ybLJyC1YwnavK4c5O2",
    },
})
    .then((response) => response.json())
    .then((data) => {
        data.forEach((item) => {
            if (item.record != user_id) {
                fetch(`https://api.jsonbin.io/v3/b/${item.record}`, {
                    method: "GET",
                    headers: {
                        "X-Master-Key":
                            "$2a$10$Qud2bXwUn9OkErPqUZ9sxOgkEOxDr5nGrk4ybLJyC1YwnavK4c5O2",
                    },
                    mode: 'cors',
                })
                    .then((response) => response.json())
                    .then((data) => {
                        const card = document.createElement("div");
                        card.className =
                            "card border my-2 py-2 ps-2 flex items-center justify-between px-2 rounded-sm";

                         card.innerHTML = `
				  <div class="flex items-center">
					  <div class="overflow-hidden object-fit rounded-full" style="width: 50px;height: 50px;">
						  <img src="${data.record.image != ""
                                ? data.record.image
                                : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"
                            }" alt="">
					  </div>
					  <div class="text-md ps-1">${data.record.name}</div>
				  </div>
				  <div class="flex">
           
           <button class="p-1 rounded-sm me-2 border" id='checkBtn-${data.metadata.id
                            }'><img src="./image/view.png" width="25px" height="25xpx" alt=""></button>

                            
					<button class="border text-white p-1 rounded flex items-center" id='giveBtn-${data.metadata.id
                            }'> <img src="./image/chocolate.png" width="20px" height="20px" alt=""></button>
				  </div>`;

                        itemList.appendChild(card);
                        const checkButton = card.querySelector(
                            `#checkBtn-${data.metadata.id}`
                        );
                        const giveButton = card.querySelector(
                            `#giveBtn-${data.metadata.id}`
                        );
                        checkButton.addEventListener("click", () => {
                            click(data.record.socialLink);
                        });
                        giveButton.addEventListener("click", () => {
                            giveChoco(data.metadata.id);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        itemList.innerHTML = "Server error";
                    });
            }
        });
    })
    .catch((error) => {
        itemList.innerHTML = "Server error";
    });
