"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/wallets/mpc/page",{

/***/ "(app-pages-browser)/./components/dashboard-layout.tsx":
/*!*****************************************!*\
  !*** ./components/dashboard-layout.tsx ***!
  \*****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DashboardLayout: () => (/* binding */ DashboardLayout)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dynamic */ \"(app-pages-browser)/./node_modules/next/dist/api/app-dynamic.js\");\n/* harmony import */ var _barrel_optimize_names_Bell_Menu_lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! __barrel_optimize__?names=Bell,Menu!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/menu.js\");\n/* harmony import */ var _barrel_optimize_names_Bell_Menu_lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! __barrel_optimize__?names=Bell,Menu!=!lucide-react */ \"(app-pages-browser)/./node_modules/lucide-react/dist/esm/icons/bell.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ui/button */ \"(app-pages-browser)/./components/ui/button.tsx\");\n/* harmony import */ var _components_ui_sheet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/components/ui/sheet */ \"(app-pages-browser)/./components/ui/sheet.tsx\");\n/* harmony import */ var _components_sidebar_provider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/components/sidebar-provider */ \"(app-pages-browser)/./components/sidebar-provider.tsx\");\n/* harmony import */ var _components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/components/ui/tooltip */ \"(app-pages-browser)/./components/ui/tooltip.tsx\");\n/* __next_internal_client_entry_do_not_use__ DashboardLayout auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nconst PageTransition = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(()=>__webpack_require__.e(/*! import() */ \"_app-pages-browser_components_page-transition_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! @/components/page-transition */ \"(app-pages-browser)/./components/page-transition.tsx\")).then((mod)=>mod.PageTransition), {\n    loadableGenerated: {\n        modules: [\n            \"components\\\\dashboard-layout.tsx -> \" + \"@/components/page-transition\"\n        ]\n    },\n    ssr: false\n});\n_c = PageTransition;\nconst Sidebar = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(()=>__webpack_require__.e(/*! import() */ \"_app-pages-browser_components_sidebar_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! @/components/sidebar */ \"(app-pages-browser)/./components/sidebar.tsx\")).then((mod)=>mod.Sidebar), {\n    loadableGenerated: {\n        modules: [\n            \"components\\\\dashboard-layout.tsx -> \" + \"@/components/sidebar\"\n        ]\n    },\n    ssr: false\n});\n_c1 = Sidebar;\nconst Breadcrumbs = (0,next_dynamic__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(()=>__webpack_require__.e(/*! import() */ \"_app-pages-browser_components_breadcrumbs_tsx\").then(__webpack_require__.bind(__webpack_require__, /*! @/components/breadcrumbs */ \"(app-pages-browser)/./components/breadcrumbs.tsx\")).then((mod)=>mod.Breadcrumbs), {\n    loadableGenerated: {\n        modules: [\n            \"components\\\\dashboard-layout.tsx -> \" + \"@/components/breadcrumbs\"\n        ]\n    },\n    ssr: false\n});\n_c2 = Breadcrumbs;\nfunction DashboardLayoutContent(param) {\n    let { children } = param;\n    _s();\n    const [isMobileNavOpen, setIsMobileNavOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.usePathname)();\n    const { isCollapsed, setCollapsed, isMobile } = (0,_components_sidebar_provider__WEBPACK_IMPORTED_MODULE_6__.useSidebar)();\n    // Close mobile nav when pathname changes\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"DashboardLayoutContent.useEffect\": ()=>{\n            setIsMobileNavOpen(false);\n        }\n    }[\"DashboardLayoutContent.useEffect\"], [\n        pathname\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_sheet__WEBPACK_IMPORTED_MODULE_5__.Sheet, {\n                open: isMobileNavOpen,\n                onOpenChange: setIsMobileNavOpen,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_sheet__WEBPACK_IMPORTED_MODULE_5__.SheetContent, {\n                    side: \"left\",\n                    className: \"p-0 w-[260px]\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Sidebar, {}, void 0, false, {\n                        fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                        lineNumber: 46,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                    lineNumber: 45,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"hidden md:block fixed top-0 left-0 h-screen transition-all duration-300 \".concat(isCollapsed ? \"w-[70px]\" : \"w-[260px]\"),\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Sidebar, {}, void 0, false, {\n                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                    lineNumber: 52,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                lineNumber: 51,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex flex-col flex-1 overflow-x-hidden \".concat(!isMobile && !isCollapsed ? \"ml-[260px]\" : !isMobile ? \"ml-[70px]\" : \"\"),\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n                        className: \"sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_4__.Button, {\n                                variant: \"ghost\",\n                                size: \"icon\",\n                                className: \"md:hidden\",\n                                onClick: ()=>setIsMobileNavOpen(true),\n                                \"aria-label\": \"Toggle navigation menu\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bell_Menu_lucide_react__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {\n                                    className: \"h-5 w-5\"\n                                }, void 0, false, {\n                                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                    lineNumber: 65,\n                                    columnNumber: 13\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                lineNumber: 58,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"flex-1\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Breadcrumbs, {}, void 0, false, {\n                                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                    lineNumber: 68,\n                                    columnNumber: 13\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                lineNumber: 67,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.TooltipProvider, {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.TooltipTrigger, {\n                                            asChild: true,\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_4__.Button, {\n                                                variant: \"ghost\",\n                                                size: \"icon\",\n                                                \"aria-label\": \"Notifications\",\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Bell_Menu_lucide_react__WEBPACK_IMPORTED_MODULE_9__[\"default\"], {\n                                                    className: \"h-5 w-5\"\n                                                }, void 0, false, {\n                                                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                                    lineNumber: 74,\n                                                    columnNumber: 19\n                                                }, this)\n                                            }, void 0, false, {\n                                                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                                lineNumber: 73,\n                                                columnNumber: 17\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                            lineNumber: 72,\n                                            columnNumber: 15\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.TooltipContent, {\n                                            children: \"Notifications\"\n                                        }, void 0, false, {\n                                            fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                            lineNumber: 77,\n                                            columnNumber: 15\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                    lineNumber: 71,\n                                    columnNumber: 13\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                lineNumber: 70,\n                                columnNumber: 11\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.TooltipProvider, {\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.Tooltip, {\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.TooltipTrigger, {\n                                            asChild: true,\n                                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_4__.Button, {\n                                                variant: \"ghost\",\n                                                size: \"icon\",\n                                                className: \"rounded-full\",\n                                                \"aria-label\": \"User menu\",\n                                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                                    src: \"/vibrant-street-market.png\",\n                                                    alt: \"User\",\n                                                    className: \"rounded-full\",\n                                                    width: 32,\n                                                    height: 32\n                                                }, void 0, false, {\n                                                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                                    lineNumber: 84,\n                                                    columnNumber: 19\n                                                }, this)\n                                            }, void 0, false, {\n                                                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                                lineNumber: 83,\n                                                columnNumber: 17\n                                            }, this)\n                                        }, void 0, false, {\n                                            fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                            lineNumber: 82,\n                                            columnNumber: 15\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_tooltip__WEBPACK_IMPORTED_MODULE_7__.TooltipContent, {\n                                            children: \"User Profile\"\n                                        }, void 0, false, {\n                                            fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                            lineNumber: 87,\n                                            columnNumber: 15\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                    lineNumber: 81,\n                                    columnNumber: 13\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                                lineNumber: 80,\n                                columnNumber: 11\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                        lineNumber: 57,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                        className: \"flex-1 p-4 md:p-6\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PageTransition, {\n                            children: children\n                        }, void 0, false, {\n                            fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                            lineNumber: 92,\n                            columnNumber: 11\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                        lineNumber: 91,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n                lineNumber: 56,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n        lineNumber: 42,\n        columnNumber: 5\n    }, this);\n}\n_s(DashboardLayoutContent, \"5lrKbsVqMfckR4Mf9/EpwkYq82E=\", false, function() {\n    return [\n        next_navigation__WEBPACK_IMPORTED_MODULE_3__.usePathname,\n        _components_sidebar_provider__WEBPACK_IMPORTED_MODULE_6__.useSidebar\n    ];\n});\n_c3 = DashboardLayoutContent;\nfunction DashboardLayout(param) {\n    let { children } = param;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_sidebar_provider__WEBPACK_IMPORTED_MODULE_6__.SidebarProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DashboardLayoutContent, {\n            children: children\n        }, void 0, false, {\n            fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n            lineNumber: 102,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"E:\\\\WorkSpace\\\\ryzer-wallet\\\\Ryzer-wallet\\\\components\\\\dashboard-layout.tsx\",\n        lineNumber: 101,\n        columnNumber: 5\n    }, this);\n}\n_c4 = DashboardLayout;\nvar _c, _c1, _c2, _c3, _c4;\n$RefreshReg$(_c, \"PageTransition\");\n$RefreshReg$(_c1, \"Sidebar\");\n$RefreshReg$(_c2, \"Breadcrumbs\");\n$RefreshReg$(_c3, \"DashboardLayoutContent\");\n$RefreshReg$(_c4, \"DashboardLayout\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvZGFzaGJvYXJkLWxheW91dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJcUQ7QUFDbkI7QUFDTztBQUNJO0FBRUU7QUFDWTtBQUNnQjtBQUN1QjtBQUVsRyxNQUFNZSxpQkFBaUJiLHdEQUFPQSxDQUFDLElBQU0sME9BQXNDLENBQUNjLElBQUksQ0FBQ0MsQ0FBQUEsTUFBT0EsSUFBSUYsY0FBYzs7Ozs7O0lBQ3hHRyxLQUFLOztLQURESDtBQUlOLE1BQU1JLFVBQVVqQix3REFBT0EsQ0FBQyxJQUFNLGtOQUE4QixDQUFDYyxJQUFJLENBQUNDLENBQUFBLE1BQU9BLElBQUlFLE9BQU87Ozs7OztJQUNsRkQsS0FBSzs7TUFEREM7QUFJTixNQUFNQyxjQUFjbEIsd0RBQU9BLENBQUMsSUFBTSw4TkFBa0MsQ0FBQ2MsSUFBSSxDQUFDQyxDQUFBQSxNQUFPQSxJQUFJRyxXQUFXOzs7Ozs7SUFDOUZGLEtBQUs7O01BRERFO0FBUU4sU0FBU0MsdUJBQXVCLEtBQTJDO1FBQTNDLEVBQUVDLFFBQVEsRUFBaUMsR0FBM0M7O0lBQzlCLE1BQU0sQ0FBQ0MsaUJBQWlCQyxtQkFBbUIsR0FBR3hCLCtDQUFRQSxDQUFDO0lBQ3ZELE1BQU15QixXQUFXcEIsNERBQVdBO0lBQzVCLE1BQU0sRUFBRXFCLFdBQVcsRUFBRUMsWUFBWSxFQUFFQyxRQUFRLEVBQUUsR0FBR2xCLHdFQUFVQTtJQUUxRCx5Q0FBeUM7SUFDekNULGdEQUFTQTs0Q0FBQztZQUNSdUIsbUJBQW1CO1FBQ3JCOzJDQUFHO1FBQUNDO0tBQVM7SUFFYixxQkFDRSw4REFBQ0k7UUFBSUMsV0FBVTs7MEJBRWIsOERBQUN2Qix1REFBS0E7Z0JBQUN3QixNQUFNUjtnQkFBaUJTLGNBQWNSOzBCQUMxQyw0RUFBQ2hCLDhEQUFZQTtvQkFBQ3lCLE1BQUs7b0JBQU9ILFdBQVU7OEJBQ2xDLDRFQUFDWDs7Ozs7Ozs7Ozs7Ozs7OzBCQUtMLDhEQUFDVTtnQkFBSUMsV0FBVywyRUFBa0gsT0FBdkNKLGNBQWMsYUFBYTswQkFDcEgsNEVBQUNQOzs7Ozs7Ozs7OzBCQUlILDhEQUFDVTtnQkFBSUMsV0FBVywwQ0FBa0gsT0FBeEUsQ0FBQ0YsWUFBWSxDQUFDRixjQUFjLGVBQWUsQ0FBQ0UsV0FBVyxjQUFjOztrQ0FDN0gsOERBQUNNO3dCQUFPSixXQUFVOzswQ0FDaEIsOERBQUN4Qix5REFBTUE7Z0NBQ0w2QixTQUFRO2dDQUNSQyxNQUFLO2dDQUNMTixXQUFVO2dDQUNWTyxTQUFTLElBQU1iLG1CQUFtQjtnQ0FDbENjLGNBQVc7MENBRVgsNEVBQUNsQyxxRkFBSUE7b0NBQUMwQixXQUFVOzs7Ozs7Ozs7OzswQ0FFbEIsOERBQUNEO2dDQUFJQyxXQUFVOzBDQUNiLDRFQUFDVjs7Ozs7Ozs7OzswQ0FFSCw4REFBQ1AsbUVBQWVBOzBDQUNkLDRFQUFDRiwyREFBT0E7O3NEQUNOLDhEQUFDRyxrRUFBY0E7NENBQUN5QixPQUFPO3NEQUNyQiw0RUFBQ2pDLHlEQUFNQTtnREFBQzZCLFNBQVE7Z0RBQVFDLE1BQUs7Z0RBQU9FLGNBQVc7MERBQzdDLDRFQUFDbkMscUZBQUlBO29EQUFDMkIsV0FBVTs7Ozs7Ozs7Ozs7Ozs7OztzREFHcEIsOERBQUNsQixrRUFBY0E7c0RBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQUdwQiw4REFBQ0MsbUVBQWVBOzBDQUNkLDRFQUFDRiwyREFBT0E7O3NEQUNOLDhEQUFDRyxrRUFBY0E7NENBQUN5QixPQUFPO3NEQUNyQiw0RUFBQ2pDLHlEQUFNQTtnREFBQzZCLFNBQVE7Z0RBQVFDLE1BQUs7Z0RBQU9OLFdBQVU7Z0RBQWVRLGNBQVc7MERBQ3RFLDRFQUFDRTtvREFBSUMsS0FBSTtvREFBNkJDLEtBQUk7b0RBQU9aLFdBQVU7b0RBQWVhLE9BQU87b0RBQUlDLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7c0RBR2pHLDhEQUFDaEMsa0VBQWNBO3NEQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0FJdEIsOERBQUNpQzt3QkFBS2YsV0FBVTtrQ0FDZCw0RUFBQ2Y7c0NBQWdCTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLM0I7R0FsRVNEOztRQUVVaEIsd0RBQVdBO1FBQ29CSyxvRUFBVUE7OztNQUhuRFc7QUFvRUYsU0FBU3lCLGdCQUFnQixLQUFrQztRQUFsQyxFQUFFeEIsUUFBUSxFQUF3QixHQUFsQztJQUM5QixxQkFDRSw4REFBQ2IseUVBQWVBO2tCQUNkLDRFQUFDWTtzQkFBd0JDOzs7Ozs7Ozs7OztBQUcvQjtNQU5nQndCIiwic291cmNlcyI6WyJFOlxcV29ya1NwYWNlXFxyeXplci13YWxsZXRcXFJ5emVyLXdhbGxldFxcY29tcG9uZW50c1xcZGFzaGJvYXJkLWxheW91dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCJcclxuXHJcbmltcG9ydCB0eXBlIFJlYWN0IGZyb20gXCJyZWFjdFwiXHJcblxyXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCBTdXNwZW5zZSB9IGZyb20gXCJyZWFjdFwiXHJcbmltcG9ydCBkeW5hbWljIGZyb20gXCJuZXh0L2R5bmFtaWNcIlxyXG5pbXBvcnQgeyBCZWxsLCBNZW51IH0gZnJvbSBcImx1Y2lkZS1yZWFjdFwiXHJcbmltcG9ydCB7IHVzZVBhdGhuYW1lIH0gZnJvbSBcIm5leHQvbmF2aWdhdGlvblwiXHJcblxyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL2J1dHRvblwiXHJcbmltcG9ydCB7IFNoZWV0LCBTaGVldENvbnRlbnQgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3NoZWV0XCJcclxuaW1wb3J0IHsgU2lkZWJhclByb3ZpZGVyLCB1c2VTaWRlYmFyIH0gZnJvbSBcIkAvY29tcG9uZW50cy9zaWRlYmFyLXByb3ZpZGVyXCJcclxuaW1wb3J0IHsgVG9vbHRpcCwgVG9vbHRpcENvbnRlbnQsIFRvb2x0aXBQcm92aWRlciwgVG9vbHRpcFRyaWdnZXIgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3Rvb2x0aXBcIlxyXG5cclxuY29uc3QgUGFnZVRyYW5zaXRpb24gPSBkeW5hbWljKCgpID0+IGltcG9ydChcIkAvY29tcG9uZW50cy9wYWdlLXRyYW5zaXRpb25cIikudGhlbihtb2QgPT4gbW9kLlBhZ2VUcmFuc2l0aW9uKSwge1xyXG4gIHNzcjogZmFsc2VcclxufSlcclxuXHJcbmNvbnN0IFNpZGViYXIgPSBkeW5hbWljKCgpID0+IGltcG9ydChcIkAvY29tcG9uZW50cy9zaWRlYmFyXCIpLnRoZW4obW9kID0+IG1vZC5TaWRlYmFyKSwge1xyXG4gIHNzcjogZmFsc2VcclxufSlcclxuXHJcbmNvbnN0IEJyZWFkY3J1bWJzID0gZHluYW1pYygoKSA9PiBpbXBvcnQoXCJAL2NvbXBvbmVudHMvYnJlYWRjcnVtYnNcIikudGhlbihtb2QgPT4gbW9kLkJyZWFkY3J1bWJzKSwge1xyXG4gIHNzcjogZmFsc2VcclxufSlcclxuXHJcbmludGVyZmFjZSBEYXNoYm9hcmRMYXlvdXRQcm9wcyB7XHJcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxyXG59XHJcblxyXG5mdW5jdGlvbiBEYXNoYm9hcmRMYXlvdXRDb250ZW50KHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pIHtcclxuICBjb25zdCBbaXNNb2JpbGVOYXZPcGVuLCBzZXRJc01vYmlsZU5hdk9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXHJcbiAgY29uc3QgcGF0aG5hbWUgPSB1c2VQYXRobmFtZSgpXHJcbiAgY29uc3QgeyBpc0NvbGxhcHNlZCwgc2V0Q29sbGFwc2VkLCBpc01vYmlsZSB9ID0gdXNlU2lkZWJhcigpXHJcblxyXG4gIC8vIENsb3NlIG1vYmlsZSBuYXYgd2hlbiBwYXRobmFtZSBjaGFuZ2VzXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHNldElzTW9iaWxlTmF2T3BlbihmYWxzZSlcclxuICB9LCBbcGF0aG5hbWVdKVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi1oLXNjcmVlbiBiZy1ncmF5LTUwIGRhcms6YmctZ3JheS05MDAgb3ZlcmZsb3cteC1oaWRkZW5cIj5cclxuICAgICAgey8qIE1vYmlsZSBOYXZpZ2F0aW9uICovfVxyXG4gICAgICA8U2hlZXQgb3Blbj17aXNNb2JpbGVOYXZPcGVufSBvbk9wZW5DaGFuZ2U9e3NldElzTW9iaWxlTmF2T3Blbn0+XHJcbiAgICAgICAgPFNoZWV0Q29udGVudCBzaWRlPVwibGVmdFwiIGNsYXNzTmFtZT1cInAtMCB3LVsyNjBweF1cIj5cclxuICAgICAgICAgIDxTaWRlYmFyIC8+XHJcbiAgICAgICAgPC9TaGVldENvbnRlbnQ+XHJcbiAgICAgIDwvU2hlZXQ+XHJcblxyXG4gICAgICB7LyogRGVza3RvcCBTaWRlYmFyICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGhpZGRlbiBtZDpibG9jayBmaXhlZCB0b3AtMCBsZWZ0LTAgaC1zY3JlZW4gdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwICR7aXNDb2xsYXBzZWQgPyBcInctWzcwcHhdXCIgOiBcInctWzI2MHB4XVwifWB9PlxyXG4gICAgICAgIDxTaWRlYmFyIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIE1haW4gQ29udGVudCAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BmbGV4IGZsZXgtY29sIGZsZXgtMSBvdmVyZmxvdy14LWhpZGRlbiAkeyFpc01vYmlsZSAmJiAhaXNDb2xsYXBzZWQgPyBcIm1sLVsyNjBweF1cIiA6ICFpc01vYmlsZSA/IFwibWwtWzcwcHhdXCIgOiBcIlwifWB9PlxyXG4gICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwic3RpY2t5IHRvcC0wIHotMTAgZmxleCBoLTE2IGl0ZW1zLWNlbnRlciBnYXAtNCBib3JkZXItYiBiZy1iYWNrZ3JvdW5kIHB4LTQgbWQ6cHgtNlwiPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICB2YXJpYW50PVwiZ2hvc3RcIlxyXG4gICAgICAgICAgICBzaXplPVwiaWNvblwiXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1kOmhpZGRlblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzTW9iaWxlTmF2T3Blbih0cnVlKX1cclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlRvZ2dsZSBuYXZpZ2F0aW9uIG1lbnVcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8TWVudSBjbGFzc05hbWU9XCJoLTUgdy01XCIgLz5cclxuICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTFcIj5cclxuICAgICAgICAgICAgPEJyZWFkY3J1bWJzIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxUb29sdGlwUHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxUb29sdGlwPlxyXG4gICAgICAgICAgICAgIDxUb29sdGlwVHJpZ2dlciBhc0NoaWxkPlxyXG4gICAgICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiZ2hvc3RcIiBzaXplPVwiaWNvblwiIGFyaWEtbGFiZWw9XCJOb3RpZmljYXRpb25zXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxCZWxsIGNsYXNzTmFtZT1cImgtNSB3LTVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgPC9Ub29sdGlwVHJpZ2dlcj5cclxuICAgICAgICAgICAgICA8VG9vbHRpcENvbnRlbnQ+Tm90aWZpY2F0aW9uczwvVG9vbHRpcENvbnRlbnQ+XHJcbiAgICAgICAgICAgIDwvVG9vbHRpcD5cclxuICAgICAgICAgIDwvVG9vbHRpcFByb3ZpZGVyPlxyXG4gICAgICAgICAgPFRvb2x0aXBQcm92aWRlcj5cclxuICAgICAgICAgICAgPFRvb2x0aXA+XHJcbiAgICAgICAgICAgICAgPFRvb2x0aXBUcmlnZ2VyIGFzQ2hpbGQ+XHJcbiAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJnaG9zdFwiIHNpemU9XCJpY29uXCIgY2xhc3NOYW1lPVwicm91bmRlZC1mdWxsXCIgYXJpYS1sYWJlbD1cIlVzZXIgbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIi92aWJyYW50LXN0cmVldC1tYXJrZXQucG5nXCIgYWx0PVwiVXNlclwiIGNsYXNzTmFtZT1cInJvdW5kZWQtZnVsbFwiIHdpZHRoPXszMn0gaGVpZ2h0PXszMn0gLz5cclxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvVG9vbHRpcFRyaWdnZXI+XHJcbiAgICAgICAgICAgICAgPFRvb2x0aXBDb250ZW50PlVzZXIgUHJvZmlsZTwvVG9vbHRpcENvbnRlbnQ+XHJcbiAgICAgICAgICAgIDwvVG9vbHRpcD5cclxuICAgICAgICAgIDwvVG9vbHRpcFByb3ZpZGVyPlxyXG4gICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImZsZXgtMSBwLTQgbWQ6cC02XCI+XHJcbiAgICAgICAgICA8UGFnZVRyYW5zaXRpb24+e2NoaWxkcmVufTwvUGFnZVRyYW5zaXRpb24+XHJcbiAgICAgICAgPC9tYWluPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERhc2hib2FyZExheW91dCh7IGNoaWxkcmVuIH06IERhc2hib2FyZExheW91dFByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxTaWRlYmFyUHJvdmlkZXI+XHJcbiAgICAgIDxEYXNoYm9hcmRMYXlvdXRDb250ZW50PntjaGlsZHJlbn08L0Rhc2hib2FyZExheW91dENvbnRlbnQ+XHJcbiAgICA8L1NpZGViYXJQcm92aWRlcj5cclxuICApXHJcbn1cclxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiZHluYW1pYyIsIkJlbGwiLCJNZW51IiwidXNlUGF0aG5hbWUiLCJCdXR0b24iLCJTaGVldCIsIlNoZWV0Q29udGVudCIsIlNpZGViYXJQcm92aWRlciIsInVzZVNpZGViYXIiLCJUb29sdGlwIiwiVG9vbHRpcENvbnRlbnQiLCJUb29sdGlwUHJvdmlkZXIiLCJUb29sdGlwVHJpZ2dlciIsIlBhZ2VUcmFuc2l0aW9uIiwidGhlbiIsIm1vZCIsInNzciIsIlNpZGViYXIiLCJCcmVhZGNydW1icyIsIkRhc2hib2FyZExheW91dENvbnRlbnQiLCJjaGlsZHJlbiIsImlzTW9iaWxlTmF2T3BlbiIsInNldElzTW9iaWxlTmF2T3BlbiIsInBhdGhuYW1lIiwiaXNDb2xsYXBzZWQiLCJzZXRDb2xsYXBzZWQiLCJpc01vYmlsZSIsImRpdiIsImNsYXNzTmFtZSIsIm9wZW4iLCJvbk9wZW5DaGFuZ2UiLCJzaWRlIiwiaGVhZGVyIiwidmFyaWFudCIsInNpemUiLCJvbkNsaWNrIiwiYXJpYS1sYWJlbCIsImFzQ2hpbGQiLCJpbWciLCJzcmMiLCJhbHQiLCJ3aWR0aCIsImhlaWdodCIsIm1haW4iLCJEYXNoYm9hcmRMYXlvdXQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/dashboard-layout.tsx\n"));

/***/ })

});