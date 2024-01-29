const clientId = "";
const clientSecret = "";
const tenantId = "";

function toastNotification(title, message) {
	document.querySelector('.fxs-toast').innerHTML = `
		<li class="fxs-toast-item fxs-popup fxs-portal-bg-txt-br msportalfx-shadow-level4" role="alert" aria-live="polite" aria-atomic="true">
			<div class="fxs-toast-wrapper">
				<div class="fxs-toast-header">
					<div class="fxs-toast-icon">
						<svg viewBox="0 0 12.7 9.1" class="" role="presentation" focusable="false" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="FxSymbol0-08d" data-type="12"><g><title></title><path d="M12.7.7 4.4 9.1 0 4.7.7 4l3.7 3.6L12 0z"></path></g></svg>
					</div>
					<div class="fxs-toast-title fxs-portal-text">${title}</div>
				</div>
				<div class="fxs-toast-description fxs-portal-title">${message}</div>
				<div class="fxc-section fxc-section-wrapper msportalfx-form fxs-notification-inlineform fxs-vivaresize">
					<div class="fxc-section fxc-section-wrapper fxs-vivaresize">
					</div>
				</div>
			</div>
		</li>`;
	setTimeout(function() {
    	document.querySelector('.fxs-toast').innerHTML = '';
	}, 5000);
}

function insertAfter(element, content) {
	let div = document.createElement('div');
	div.innerHTML = content;
	let newElement = div.firstChild;
	element.parentNode.parentNode.insertBefore(newElement, element.parentNode.nextSibling);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getToken = async (clientId, clientSecret, tenantId) => {
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", `application/json`);
	let body = {
		clientId: clientId,
		clientSecret: clientSecret,
		tenantId: tenantId,
	}
	let requestInit = { 
		method: 'POST',
		headers: requestHeaders,
		mode: 'cors',
		body: JSON.stringify(body),
		cache: 'default'
	};
	let request = await fetch(`https://getazuremgmttoken.azurewebsites.net/`, requestInit);
	let data = await request.json();
	return data;
};

const postResourceV1 = async (resourceUri, body, accessToken, apiVersion) => {
	let requestHeaders = new Headers();
	requestHeaders.append("Authorization", `Bearer ${accessToken}`);
	requestHeaders.append("Content-Type", `application/json`);
	let requestInit = { 
		method: 'POST',
		headers: requestHeaders,
		mode: 'cors',
		body: JSON.stringify(body),
		cache: 'default'
	};
	const request = await fetch(`https://management.azure.com${resourceUri}?api-version=${apiVersion}`, requestInit);
	const data = await request;
	return data;
}

const changeResourceStatus = async (action) => {
	let currentUrl = window.location.href;
	let tokenInfo = await getToken(clientId, clientSecret, tenantId);
	
	if (tokenInfo.accessToken) {
		if (/\/providers\/Microsoft\.Network\/applicationGateways\/.*\/overview/.test(currentUrl)) {
			let appGwRequest = await postResourceV1(`/${currentUrl.split('/resource/')[1].split('/overview')[0]}/${action}`, {}, tokenInfo.accessToken, '2022-01-01');
			if (appGwRequest.status < 205) {
				toastNotification(`Success`, `"${capitalizeFirstLetter(action)}" request sent to the resource`);
			} 
			else {
				toastNotification(`Request error`, `Error sending the request to the selected resource`);
			}
		}
	}
	else {
		toastNotification(`Token error`, `Error getting access token`);
	}
};

const liStop = `<li role="presentation" class="azc-toolbar-item azc-toolbarButton fxs-vivaresize li-missing-button-stop" title="Stop">
	<div class="fxs-portal-hover" aria-label="Stop" title="Stop" role="button" tabindex="0" style="position: relative; display: flex; align-items: center; padding: 0 8px; height: 36px;">
		<div class="azc-toolbarButton-icon">
			<svg viewBox="0 0 16 16" class="" role="presentation" focusable="false" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-type="58"><g><title></title><path d="M15 1v14H1V1h14m1-1H0v16h16V0z"></path></g></svg>
		</div>
		<div class="azc-toolbarButton-label">
			Stop
		</div>
	</div>
</li>`;

const liStart = `<li role="presentation" class="azc-toolbar-item azc-toolbarButton fxs-vivaresize li-missing-button-start" title="Start">
	<div class="fxs-portal-hover" aria-label="Start" title="Start" role="button" tabindex="0" style="position: relative; display: flex; align-items: center; padding: 0 8px; height: 36px;">
		<div class="azc-toolbarButton-icon">
			<svg viewBox="0 0 12.3 14" class="" role="presentation" focusable="false" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="FxSymbol0-02a" data-type="61"><g><title></title><path d="M1 1.7 10.2 7 1 12.3V1.7M0 0v14l12.3-7L0 0z"></path></g></svg>
		</div>
		<div class="azc-toolbarButton-label">
			Start
		</div>
	</div>
</li>`;

const liRestart = `<li role="presentation" class="azc-toolbar-item azc-toolbarButton fxs-vivaresize li-missing-button-restart" title="Restart" >
	<div class="fxs-portal-hover" aria-label="Restart" title="Restart" role="button" tabindex="0" style="position: relative; display: flex; align-items: center; padding: 0 8px; height: 36px;">
		<div class="azc-toolbarButton-icon">
			<svg viewBox="0 0 12 15.9" class="" role="presentation" focusable="false" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="FxSymbol0-02b" data-type="157"><g><title></title><path d="M7 4h3.3L9.2 2.9A4.8 4.8 0 0 0 8.1 2 4.1 4.1 0 0 0 7 1.3 4 4 0 0 0 5.5 1a3.9 3.9 0 0 0-1.8.4 3.3 3.3 0 0 0-1.4 1 3.4 3.4 0 0 0-.9 1.4A3.3 3.3 0 0 0 1 5.5a5.1 5.1 0 0 0 .3 1.7 7.1 7.1 0 0 0 1 1.4l6.5 6.5-.7.8-6.5-6.6A6.6 6.6 0 0 1 .4 7.6 5.2 5.2 0 0 1 0 5.5a5.9 5.9 0 0 1 .2-1.4 3.1 3.1 0 0 1 .6-1.3 5 5 0 0 1 .8-1.2L2.7.8A7.5 7.5 0 0 1 4 .2L5.5 0l1.2.2a1.9 1.9 0 0 1 1 .3l.9.5.8.7.7.7.9.9V0h1v5H7z"></path></g></svg>
		</div>
		<div class="azc-toolbarButton-label">
			Restart
		</div>
	</div>
</li>`;

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            let refreshButton = document.querySelector('.azc-toolbarButton-container[title="Refresh"]');
            if (refreshButton) {
                refreshButton.addEventListener("click", async () => {
                    if (!refreshButton.classList.contains('missing-buttons')) {
                        refreshButton.classList.add('missing-buttons');
                        let currentUrl = window.location.href;
                        if (/\/providers\/Microsoft\.Network\/applicationGateways\/.*\/overview/.test(currentUrl)) {
                            insertAfter(refreshButton, liStop);
                            insertAfter(refreshButton, liRestart);
                            insertAfter(refreshButton, liStart);
                        }
                    }
                });
            }
            let stopButton = document.querySelector('.li-missing-button-stop');
            if (stopButton && !stopButton.listenerAdded) {
                stopButton.addEventListener("click", async () => {
                    changeResourceStatus("stop");
                });
                stopButton.listenerAdded = true;
            }
            let startButton = document.querySelector('.li-missing-button-start');
            if (startButton && !startButton.listenerAdded) {
                startButton.addEventListener("click", async () => {
                    changeResourceStatus("start");
                });
                startButton.listenerAdded = true;
            }
            let restartButton = document.querySelector('.li-missing-button-restart');
            if (restartButton && !restartButton.listenerAdded) {
                restartButton.addEventListener("click", async () => {
                    changeResourceStatus("restart");
                });
                restartButton.listenerAdded = true;
            }
        }
    });
});

let config = { childList: true, subtree: true };

observer.observe(document.body, config);