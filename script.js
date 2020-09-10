//BACK END
const getData = (function(){
	const DOMstrings = {
		todo: ".input-todo",
		todoList: ".todo__list",
		date: ".input-date",
		button: ".button",
		delete: ".delete",
		todoInfo: ".todo__right",
		infoSubmit: ".info-submit",
		todoInfoHeader: ".todo__header-end",
		todoContent: ".todo__information-end p",
		todoContainer: ".todo__info-container",
		textArea: ".text-area",
		init: ".default",
		start: ".start",
		middle: ".middle",
		end: ".end"
	}
	
	let todoElement = document.querySelector(DOMstrings.todo);
	let listElement = document.querySelector(DOMstrings.todoList);
	let dateElement = document.querySelector(DOMstrings.date);
	let buttonElement = document.querySelector(DOMstrings.button);
	let deleteElement = document.querySelector(DOMstrings.delete);
	let infoSubmitElement = document.querySelector(DOMstrings.infoSubmit);
	let todoInfoElement = document.querySelector(DOMstrings.todoInfo);
	let todoInfoHeaderElement = document.querySelector(DOMstrings.todoInfoHeader);
	let todoInfoContentElement = document.querySelector(DOMstrings.todoContent);
	let todoInfoContainerElement = document.querySelector(DOMstrings.todoContainer);
	let textarea = document.querySelector(DOMstrings.textArea);
	let init = document.querySelector(DOMstrings.init);
	let start = document.querySelector(DOMstrings.start);
	let middle = document.querySelector(DOMstrings.middle);
	let end = document.querySelector(DOMstrings.end);
	
	//Array for todo items
	let todoArray = [];
	

	//Todo class
	class Todo{
		constructor(todo, date, id, hasInfo = false, info){
			this.todo = todo;
			this.date = date;
			this.id = id;
			this.hasInfo = hasInfo;
			this.info = info;
		}
	}

	
	//ADD OBJECT TO TODO ARRAY
	buttonElement.addEventListener("click", (e) => {
		let id = 0;
		if(todoArray.length === 0){
			id = 1;
		} else {
			id = (todoArray[todoArray.length - 1].id) + 1 
		}
		
		let currentTodo = todoElement.value;
		let currentTodoDate = dateElement.value;

		let newTodo = new Todo(currentTodo, currentTodoDate, id);

		todoArray.push(newTodo);
		console.log("From the backend: ", newTodo);
	})



	return{
		getDOMelements(){
			return {
				todo: todoElement,
				todoList: listElement,
				date: dateElement,
				button: buttonElement,
				delete: deleteElement,
				infoSubmit: infoSubmitElement,
				todoInfo: todoInfoElement,
				todoHeader: todoInfoHeaderElement,
				todoContent: todoInfoContentElement,
				todoContainer: todoInfoContainerElement,
				textArea: textarea,
				start: start,
				middle: middle,
				end: end,
				init: init


			}
		},
		
		array: todoArray

	}

})()





//FRONT END
const insertData = (function(data){
	let DOMelements = data.getDOMelements();
	let array = data.array;
	let currentIndex;


	// Add new todo item
	DOMelements.button.addEventListener("click", (e) => {
		// Preventing default browser refresh event on click
		e.preventDefault();
		
		// Accessing the last array object
		let getLastArrayItem = array[array.length - 1];
		
		// Accessing the key values from the last object.
		let todo = getLastArrayItem.todo;
		let date = formatDateForUI(getLastArrayItem.date);
		let id = getLastArrayItem.id;

		DOMelements.todoList.insertAdjacentHTML("beforeend", insertListItem(todo, date, id));


	})

	function formatDateForUI(date){
		// Split date into array
		let dateArray = date.split("-");
		
		// Return new date format
		return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`

	}

	
	// Delete new todo item
	DOMelements.todoList.addEventListener("click", (e) => {
		
		// only if the click target class matches .delete
		if(e.target.matches(".delete")){
			//saving the id of the click target
			let id = e.target.id;
			
			// filter function that returns the object that has an id key value that matches the click target id
			let deleteItem = array.filter((arrayItem) => { 
				return arrayItem.id == id;
			})

			// removing the delete item object from the array as .findIndex() wont find the index...
			// of the object if it is still in the array produced by the filter method.
			let removeDeleteItemFromArrayReturnedByTheFilterFunction = deleteItem.pop();

			// finding the index or the object returned by .pop()
			let deletePosition = array.findIndex(x => {
				return x == removeDeleteItemFromArrayReturnedByTheFilterFunction;
			});

			// remove the item from the array by index
			let deletedItem = array.splice(deletePosition, 1);

			// logging the deleted item for testing purposes
			console.log(deletedItem);
			
			
			elementId = document.getElementById(id);
			
			// calling the remove html function
			removeElementsFromHTML(elementId);

			// Change the right side back to the start if all list items are deleted
			if(array.length === 0){
				DOMelements.start.style.display = "block";
				DOMelements.middle.style.display = "none";
				DOMelements.end.style.display = "none";
			} 
		}

		

		// a function that removes element from html based on the id number
		function removeElementsFromHTML(idNumber){
			let nodeList = idNumber.lastChild;
		
			idNumber.parentNode.removeChild(idNumber);
		}

		
	})

	// GET INFO ABOUT A TODO
	DOMelements.todoList.addEventListener("click", (e) => {
		
		if(e.target.matches(".info")){

			let id = e.target.id;
			
			let findArrayItem = array.filter((x) => {
				return x.id == id;
			});

			let foundArrayItem = findArrayItem.pop();
			

			const index = array.findIndex((x) => {
				return x == foundArrayItem;
			})
			
			currentIndex = index;
			
			if(array[currentIndex].hasInfo === true){
				
				DOMelements.todoHeader.textContent = array[index].todo;
				DOMelements.todoContent.textContent = array[index].info;

				
				DOMelements.start.style.display = "none";
				DOMelements.middle.style.display = "none";
				DOMelements.end.style.display = "block";

			} else if (array[currentIndex].hasInfo === false){

				
				DOMelements.start.style.display = "none";
				DOMelements.middle.style.display = "block";
				DOMelements.end.style.display = "none"
				
				// ADD EXTRA INFORMATION TO THE TODO EXTRA INFO TO THE RIGHT OF THE TODO LIST
				DOMelements.todoInfo.addEventListener("click", (e) => {
					if(e.target.matches(".info-submit")){
						console.log(currentIndex);
						e.preventDefault();
						array[currentIndex].info = DOMelements.textArea.value;
						DOMelements.todoHeader.textContent = array[currentIndex].todo;
						DOMelements.todoContent.textContent = array[currentIndex].info;
						DOMelements.middle.style.display = "none";
						DOMelements.end.style.display = "block";
						
						array[currentIndex].hasInfo = true;
						
					} 
				});

			}
			
			
		}
		
	})

	const insertListItem = (newTodo, newDate, newId) => {
		return `
		<li class="todo-item" id="${newId}">
			<a href="#" class="todo__item-title"><strong>${newTodo}</strong> | Complete by: ${newDate}</a>
			<span class="icon info" id="${newId}">&#x25BA;</span>
			<span class="icon delete" id="${newId}">&times;</span>
		</li>
			`
	}
	
})(getData)