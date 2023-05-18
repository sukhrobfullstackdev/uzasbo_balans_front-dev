import React from 'react'

export const BuildingIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect x="0" y="0" width="24" height="24" />
                    <path d="M13.5,21 L13.5,18 C13.5,17.4477153 13.0522847,17 12.5,17 L11.5,17 C10.9477153,17 10.5,17.4477153 10.5,18 L10.5,21 L5,21 L5,4 C5,2.8954305 5.8954305,2 7,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,21 L13.5,21 Z M9,4 C8.44771525,4 8,4.44771525 8,5 L8,6 C8,6.55228475 8.44771525,7 9,7 L10,7 C10.5522847,7 11,6.55228475 11,6 L11,5 C11,4.44771525 10.5522847,4 10,4 L9,4 Z M14,4 C13.4477153,4 13,4.44771525 13,5 L13,6 C13,6.55228475 13.4477153,7 14,7 L15,7 C15.5522847,7 16,6.55228475 16,6 L16,5 C16,4.44771525 15.5522847,4 15,4 L14,4 Z M9,8 C8.44771525,8 8,8.44771525 8,9 L8,10 C8,10.5522847 8.44771525,11 9,11 L10,11 C10.5522847,11 11,10.5522847 11,10 L11,9 C11,8.44771525 10.5522847,8 10,8 L9,8 Z M9,12 C8.44771525,12 8,12.4477153 8,13 L8,14 C8,14.5522847 8.44771525,15 9,15 L10,15 C10.5522847,15 11,14.5522847 11,14 L11,13 C11,12.4477153 10.5522847,12 10,12 L9,12 Z M14,12 C13.4477153,12 13,12.4477153 13,13 L13,14 C13,14.5522847 13.4477153,15 14,15 L15,15 C15.5522847,15 16,14.5522847 16,14 L16,13 C16,12.4477153 15.5522847,12 15,12 L14,12 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`}
                    />
                    <rect fill="#FFFFFF" x="13" y="8" width="3" height="3" rx="1" />
                    <path d="M4,21 L20,21 C20.5522847,21 21,21.4477153 21,22 L21,22.4 C21,22.7313708 20.7313708,23 20.4,23 L3.6,23 C3.26862915,23 3,22.7313708 3,22.4 L3,22 C3,21.4477153 3.44771525,21 4,21 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3"
                    />
                </g>
            </svg>
        </span>
    )
}

export const PhoneIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x">
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect x="0" y="0" width="24" height="24" />
                    <path d="M7.13888889,4 L7.13888889,19 L16.8611111,19 L16.8611111,4 L7.13888889,4 Z M7.83333333,1 L16.1666667,1 C17.5729473,1 18.25,1.98121694 18.25,3.5 L18.25,20.5 C18.25,22.0187831 17.5729473,23 16.1666667,23 L7.83333333,23 C6.42705272,23 5.75,22.0187831 5.75,20.5 L5.75,3.5 C5.75,1.98121694 6.42705272,1 7.83333333,1 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} fillRule="nonzero"
                    />
                    <polygon fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3" points="7 4 7 19 17 19 17 4" />
                    <circle fill={`${fill ? fill : 'dodgerblue'}`} cx="12" cy="21" r="1" />
                </g>
            </svg>
        </span>
    )
}

export const MarkerIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect x="0" y="0" width="24" height="24" />
                    <path d="M5,10.5 C5,6 8,3 12.5,3 C17,3 20,6.75 20,10.5 C20,12.8325623 17.8236613,16.03566 13.470984,20.1092932 C12.9154018,20.6292577 12.0585054,20.6508331 11.4774555,20.1594925 C7.15915182,16.5078313 5,13.2880005 5,10.5 Z M12.5,12 C13.8807119,12 15,10.8807119 15,9.5 C15,8.11928813 13.8807119,7 12.5,7 C11.1192881,7 10,8.11928813 10,9.5 C10,10.8807119 11.1192881,12 12.5,12 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} fillRule="nonzero"
                    />
                </g>
            </svg>
        </span>
    )
}

export const ArrowFromBottomIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24" />
                    <rect fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3" x="11" y="3" width="2" height="14" rx="1" />
                    <path d="M6.70710678,10.7071068 C6.31658249,11.0976311 5.68341751,11.0976311 5.29289322,10.7071068 C4.90236893,10.3165825 4.90236893,9.68341751 5.29289322,9.29289322 L11.2928932,3.29289322 C11.6714722,2.91431428 12.2810586,2.90106866 12.6757246,3.26284586 L18.6757246,8.76284586 C19.0828436,9.13603827 19.1103465,9.76860564 18.7371541,10.1757246 C18.3639617,10.5828436 17.7313944,10.6103465 17.3242754,10.2371541 L12.0300757,5.38413782 L6.70710678,10.7071068 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} fillRule="nonzero"
                    />
                    <rect fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.5" x="3" y="19" width="18" height="2" rx="1" />
                </g>
            </svg>
        </span>
    )
}

export const ArrowToBottomIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24" />
                    <rect fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3" x="11" y="3" width="2" height="14" rx="1" />
                    <path d="M6.70710678,16.7071068 C6.31658249,17.0976311 5.68341751,17.0976311 5.29289322,16.7071068 C4.90236893,16.3165825 4.90236893,15.6834175 5.29289322,15.2928932 L11.2928932,9.29289322 C11.6714722,8.91431428 12.2810586,8.90106866 12.6757246,9.26284586 L18.6757246,14.7628459 C19.0828436,15.1360383 19.1103465,15.7686056 18.7371541,16.1757246 C18.3639617,16.5828436 17.7313944,16.6103465 17.3242754,16.2371541 L12.0300757,11.3841378 L6.70710678,16.7071068 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} fillRule="nonzero" transform="translate(12.000003, 12.999999) scale(1, -1) translate(-12.000003, -12.999999) "
                    />
                    <rect fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.5" x="3" y="19" width="18" height="2" rx="1" />
                </g>
            </svg>
        </span>
    )
}

export const ExchangeIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24" />
                    <rect fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3" transform="translate(13.000000, 6.000000) rotate(-450.000000) translate(-13.000000, -6.000000) " x="12" y="8.8817842e-16" width="2" height="12" rx="1" />
                    <path d="M9.79289322,3.79289322 C10.1834175,3.40236893 10.8165825,3.40236893 11.2071068,3.79289322 C11.5976311,4.18341751 11.5976311,4.81658249 11.2071068,5.20710678 L8.20710678,8.20710678 C7.81658249,8.59763107 7.18341751,8.59763107 6.79289322,8.20710678 L3.79289322,5.20710678 C3.40236893,4.81658249 3.40236893,4.18341751 3.79289322,3.79289322 C4.18341751,3.40236893 4.81658249,3.40236893 5.20710678,3.79289322 L7.5,6.08578644 L9.79289322,3.79289322 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} fillRule="nonzero" transform="translate(7.500000, 6.000000) rotate(-270.000000) translate(-7.500000, -6.000000) "
                    />
                    <rect fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3" transform="translate(11.000000, 18.000000) scale(1, -1) rotate(90.000000) translate(-11.000000, -18.000000) " x="10" y="12" width="2" height="12" rx="1" />
                    <path d="M18.7928932,15.7928932 C19.1834175,15.4023689 19.8165825,15.4023689 20.2071068,15.7928932 C20.5976311,16.1834175 20.5976311,16.8165825 20.2071068,17.2071068 L17.2071068,20.2071068 C16.8165825,20.5976311 16.1834175,20.5976311 15.7928932,20.2071068 L12.7928932,17.2071068 C12.4023689,16.8165825 12.4023689,16.1834175 12.7928932,15.7928932 C13.1834175,15.4023689 13.8165825,15.4023689 14.2071068,15.7928932 L16.5,18.0857864 L18.7928932,15.7928932 Z"
                        fill={`${fill ? fill : 'dodgerblue'}`} fillRule="nonzero" transform="translate(16.500000, 18.000000) scale(1, -1) rotate(270.000000) translate(-16.500000, -18.000000) "
                    />
                </g>
            </svg>
        </span>
    )
}

export const MoneyIcon = ({ fill }) => {
    return (
        <span className="svg-icon svg-icon-primary svg-icon-2x"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="24" height="24" />
                <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z"
                    fill={`${fill ? fill : 'dodgerblue'}`} opacity="0.3" transform="translate(11.500000, 12.000000) rotate(-345.000000) translate(-11.500000, -12.000000) "
                />
                <path d="M2,6 L21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 L2,18 C1.44771525,18 1,17.5522847 1,17 L1,7 C1,6.44771525 1.44771525,6 2,6 Z M11.5,16 C13.709139,16 15.5,14.209139 15.5,12 C15.5,9.790861 13.709139,8 11.5,8 C9.290861,8 7.5,9.790861 7.5,12 C7.5,14.209139 9.290861,16 11.5,16 Z M11.5,14 C12.6045695,14 13.5,13.1045695 13.5,12 C13.5,10.8954305 12.6045695,10 11.5,10 C10.3954305,10 9.5,10.8954305 9.5,12 C9.5,13.1045695 10.3954305,14 11.5,14 Z"
                    fill={`${fill ? fill : 'dodgerblue'}`}
                />
            </g>
        </svg>
        </span>
    )
}