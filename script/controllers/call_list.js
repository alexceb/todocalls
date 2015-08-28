(function () {

	angular
		.module('todocallsApp')
		.controller('listController', listController);

	function listController() {

		var vm = this;

		//Display options
		var displayOptions = {
			'all_calls': 0,
			'next_calls': 1,
			'finished_calls': 2
		};
		var currentDisplayOption = displayOptions['all_calls'];

		vm.savedCalls = localStorage.getItem('callList');

		vm.calls = (localStorage.getItem('callList') !== null ) ?
					JSON.parse(vm.savedCalls) :
					[];

		vm.nextCall = showNextCall(vm.calls);

		setList(currentDisplayOption);

		//Default sorting by time ASC
		vm.predicate = '-time';
		vm.reverse = true;

		localStorage.setItem('callList', JSON.stringify(vm.calls));

		vm.order = function(predicate) {
		    vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
		    vm.predicate = predicate;
		};

		vm.setDisplayOption = function(option) {

			var curDispOpt = currentDisplayOption;

			if (option in displayOptions) {
				curDispOpt = displayOptions[option];
			}
			console.log(curDispOpt);
			setList(curDispOpt);
		};

		vm.addItem = function () {

			var 
				id,
				tempData;

			if (nameFieldIsValid(vm.callName) /*&& vm.phoneFieldIsValid(vm.callPhone)*/) {

				id = new Date().getTime();
				tempData = {
					id: id,
					name: vm.callName,
					phone: formatPhone(vm.callPhone),
					time: formatTime(vm.callTime)
				};

				vm.calls.push(tempData);
				localStorage.setItem('callList', JSON.stringify(vm.calls));
			}

			vm.callName = "";
			vm.callPhone = "";
			vm.callTime = "";
		};

		vm.removeCall = function (call) {

			var index = vm.calls.map(function(elem) { return elem.id; }).indexOf(call.id);

			if (index > -1) {
			    vm.calls.splice(index, 1);
			}

			localStorage.setItem('callList', JSON.stringify(vm.calls));
		};

		vm.checkCallTime = function (call) {

			var now = new Date();
			var formatNow = formatTime(now);
			return call.time < formatNow;

		};

		function nameFieldIsValid (name) {

			if (name.length > 30) {
				alert("Name can only contain 30 characters max");
				return false;
			} 
			else if (/[^a-zA-Z0-9\-]/.test(name)) {
				alert("Name can only contain alphanumeric characters and hypehns(-)");
				return false;
			}

			return true;
		}

		function validatePhoneField (phone) {

			if (phone.substr(0,2) === "00" || phone.substr(0,1) === "+") {
				
			}
			else {
				
			}
		}

		function setList(option) {

			var filterFn,
				calls;

			switch (option) {

				case 0:
					vm.calls = JSON.parse(localStorage.getItem('callList'));
					break;
				case 1:
					filterFn = function(call) {
						var now = new Date();
						var formatNow = formatTime(now);
						return call.time >= formatNow;
					};
					break;
				case 2:
					filterFn = function(call) {
						var now = new Date();
						var formatNow = formatTime(now);
						return call.time < formatNow;
					}
					break;
			}

			if (filterFn !== undefined) {
				vm.calls = JSON.parse(localStorage.getItem('callList'));
				calls = vm.calls.filter(filterFn);
				vm.calls = calls;
				console.log(vm.calls);
			}
		}

		function showNextCall(calls) {

			var result = calls.filter(function (call) {
				var now = new Date();
				var formatNow = formatTime(now);
				return call.time >= formatNow;
			})[0];

			return result;
		}

		function formatPhone (phone) {

			var phone = phone.replace(/[^\d]/g, "");
			var prefix = "00";

			var formatedPhone = phone.substr(0,2) === "00" ? 
								prefix + phone.substr(2).replace(/(\d{3})/g, '$1 ')
								: 
								prefix + phone.replace(/(\d{3})/g, '$1 ');

			return formatedPhone;
		}

		function formatTime (time) {

			var hours = time.getHours() >= 10 ?
							time.getHours()
							:
							"0" + time.getHours();

			var minutes = time.getMinutes() >= 10 ?
							time.getMinutes()
							:
							"0" + time.getMinutes();

			var formatedTime = hours + ":" + minutes;

			return formatedTime;
		}
	}

})();