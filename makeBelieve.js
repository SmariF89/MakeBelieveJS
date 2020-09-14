
// This makes sure that everything is run on document ready.
(function() {
	// Constructor function - ordinary function really, but the way
	// it is implemented gives it a Constructor like role.
	function MakeBelieveElement(DOMElements, length) {
		this.elements = DOMElements;
		this.length = length;

		// Functionality #3
		this.parent = function(query) {

			// If there is only one element, this element has only one parent
			// and can be returned instantly.
			if(this.elements.length == 1) {
				return new MakeBelieveElement(this.elements[0].parentElement, 1);
			}

			var parents = [];

			for (var i = 0; i < this.elements.length; i++) {
				var currElement = this.elements[i];

				// To avoid unwanted repetition
				if(parents.includes(currElement.parentElement)){
					continue;
				}

				// If query matches parent selector or there is no query,
				// parent node of current element will be added to the list.
				if(currElement.parentElement.matches(query) || !query) {
						parents.push(currElement.parentElement);
					}
			}
			// If query does not match anything, return nothing
			if(parents.length == 0) {
				return {};
			}

			return new MakeBelieveElement(parents, parents.length);
		}

		// Functionality #4
		this.grandParent = function(query) {

			// If there is only one element, this element has only one grandparent
			// and can be returned instantly.
			if(this.elements.length == 1 && this.elements[0].parentElement.parentElement) {
				return new MakeBelieveElement(this.elements[0].parentElement.parentElement, 1);
			}

			var grandParents = [];

			for (var i = 0; i < this.elements.length; i++) {
				var currElement = this.elements[i];

				// To avoid unwanted repetition
				if(grandParents.includes(currElement.parentElement.parentElement)){
					continue;
				}

				// If query matches parent selector or there is no query,
				// grandparent node of current element will be added to the list.
				if(currElement.parentElement.parentElement.matches(query) || !query) {
						grandParents.push(currElement.parentElement.parentElement);
					}
			}

			if(grandParents.length == 0) {
				return {};
			}
			return new MakeBelieveElement(grandParents, grandParents.length);
		}

		// Functionality #5
		this.ancestor = function(query) {
			// Input check
			if(!query){ return {}; }

			// For each element, try to find a matching ancestor.
			for(var i = 0; i < this.elements.length; i++){
				var currElement = this.elements[i];

				// This loop breaks if a match is found or if no match has
				// been found when the root of the document has been reached.
				do {
					currElement = currElement.parentElement;

					// Match found, return.
					if(currElement.matches(query)){
						return new MakeBelieveElement(currElement, 1);
					}
				} while(!currElement.matches(":root"));
			}

			// Nothing found, returning an empty object.
			return {};
		}

		// Functionality #6
		this.onClick = function(fx) {
			// Adding a "click" eventListener on each element found.
			for(var i = 0; i < this.elements.length; i++){
				this.elements[i].addEventListener("click", fx);
			}
			return this;
		}

		// Functionality #7
		this.insertText = function(query) {
			// If there is query string, inner html of all found elements
			// will be set to the query string.
			if(query) {
				for (var i = 0; i < this.elements.length; i++) {
					this.elements[i].innerHTML = query;
				}
			}

			return this;
		}

		// Functionality #8
		this.append = function(query) {
			// If there is query string, the valid html string or the DOM element node
			// will be appended to all found elements.
			if(query) {
				for (var i = 0; i < this.elements.length; i++) {
					// Check if query is a valid DOM element node.
					if(query.nodeType === Node.ELEMENT_NODE){
						this.elements[i].appendChild(query);
					}
					else if(query){
						this.elements[i].innerHTML += query;
					}
				}
			}

			return this;
		}

		// Functionality #9
		this.prepend = function(query) {
			// If there is query string, the valid html string or the DOM element node
			// will be prepended to all found elements.
			if(query) {
				for (var i = 0; i < this.elements.length; i++) {
					// Check if query is a valid DOM element node.
					if(query.nodeType === Node.ELEMENT_NODE) {
						this.elements[i].insertBefore(query, this.elements[i].firstChild);
					}
					else if(query){
						this.elements[i].innerHTML = query + this.elements[i].innerHTML;
					}
				}
			}
			return this;
		}

		// Functionality #10
		this.delete = function() {
			 // if there is a match found
				if(this.elements) {
						for (var i = 0; i < this.elements.length; i++) {
							// we delete all of those matches
							this.elements[i].parentNode.removeChild(this.elements[i]);
						}
				}
				else {
					return {};
				}
		}

		// Functionality # 11 - See end of document.

		// Functionality #12
		this.css = function(property, value) {
			// For all elements found in DOM, a style attribute will be added
			// with its property set to value.
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style[property] = value;
			}

			return this;
		}


		// Functionality #13
		this.toggleClass = function(query) {
			// For all elements found in DOM a css class equal to the query string
			// will either be added to the elements attributes(if the css class is not there)
			// or removed(if the css class is there).
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].classList.toggle(query);
			}

			return this;
		}

    	//Functionality #14
		this.onSubmit = function(x) {
			// we add an EventListener to the form itself
			// all of the input fields inside a form
			// and does not add EventListener to those input fields
			// who are outside of a form
			this.elements[0].addEventListener("submit", x);
			return this;
		}

		// Functionality #15
		this.onInput = function(fx) {
				// Adding an "input" eventListener on each element found.
		for(var i = 0; i < this.elements.length; i++) {
			this.elements[i].addEventListener("input", fx, false);
		}
		return this;
		}
	};

	// Inner function, which takes in the query string and finds all
	// elements found in DOM.
	var innerMakeBelieve = function(query) {
		// Get all elements from document.
		var elements = document.querySelectorAll(query);

		// If elements are found, a new MakeBelieveElement will be returned.
		// If no elements are found, an empty object is returned.
		if(elements) {
			return new MakeBelieveElement(elements, elements.length);
		}

		return {};
	};

	// Make innerMakeBelieve accessible out of scope.
	window.__ = innerMakeBelieve;

	// Functionality #11
	// An extended method, Ajax functionality.
	__.ajax = function(object) {
		// the object must contain URL. If not, nothing will happen.
		if(object.url){

			// Check if callbacks to success, fail or beforeSend. If not
			// they default to null.
			object.success = (object.success ? object.success : null);
			object.fail = (object.fail ? object.fail : null);
			object.beforeSend = (object.beforeSend ? object.beforeSend : null);

			// Various validation for configurations that came with the object.
			// If there are no configurations, an appropriate default will be set for
			// the configuration.
			var inputMethod = (object.method).toLowerCase();
			var method = ((inputMethod == 'get' ||
						   inputMethod == 'post' ||
						   inputMethod == 'delete' ||
						   inputMethod == 'put')? inputMethod : 'get');

			var timeOut = (object.timeout ? object.timeout : 0);
			var data = (object.data ? JSON.stringify(object.data) : {});
			var headers = (object.headers ? object.headers : {});

			// A new XMLHttpRequest is made, opened and
			// the configurations that came witht the object are added
			// to the request.
			var httpRequest = new XMLHttpRequest();
			httpRequest.open(method, object.url);
			httpRequest.timeout = timeOut;

			for(var i = 0; i < headers.length; i++) {
				var key = Object.entries(headers[i])[0][0];
				var value = Object.entries(headers[i])[0][1];
				httpRequest.setRequestHeader(key, value);
			}

			// on readystatechanged, if the request is done an a appropriate response
			// is set to the objects fail, success function.
			httpRequest.onreadystatechange = function () {
				if(httpRequest.readyState === XMLHttpRequest.DONE) {
					if(httpRequest.status == 200) {
						object.success(httpRequest.responseText);
					}else {
						object.fail(httpRequest.responseText);
					}
				}
			}

			// If object includes the beforeSend function, the request is sent
			// to the function for the user to modify if needed.
			if(object.beforeSend) {
				object.beforeSend(httpRequest);
			}

			// Finally, the request is sent with the data.
			httpRequest.send(data);
		}
	}
})();
