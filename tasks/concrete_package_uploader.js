/**
 * @project:   concrete5 Package Uploader Module for GruntJS
 *
 * @author     Fabian Bitter
 * @copyright  (C) 2017 Fabian Bitter (www.bitter.de)
 * @license    MIT
 * @version    0.0.1
 */

var concretePackageUploader;

module.exports = function (grunt) {
    grunt.registerTask('concrete_package_uploader', 'concrete5 Package Uploader', function () {
        concretePackageUploader = {
            config: {},
            done: null,
            request: null,
            cheerio: null,
            jar: null,
            fs: null,
            sprintf: null,
            path: null,

            defaults: {
                productType: "add_on",
                packageHandle: "",
                shortDescription: "",
                description: "",
                keywords: "",
                exampleUrl: "",
                screencast: "",
                singlePrice: "",
                fivePrice: "",
                purchaseMessage: "Thank you for your purchase. If you take the time to submit a review, I'd love to give you a 10% discount on the next copy of this you purchase.",
                requiredVersion: "5.7.0.4",
                version: "1.0",
                packageFile: "",
                licenseType: "Standard",
                licenseText: "",
                supportPlan: 12,
                supportHostedOffsite: false,
                supportHostedOffsiteUrl: "",
                offersPaidSupport: "",
                supportPrice: "",
                pageTypes: "",
                customizableStyles: false,
                skillLevel: "Beginner",
                containsPageTypes: "",
                versionHistory: "",
                themeThumbnail: "",
                notes: "",
                dependencies: []
            },

            enums: {
                productTypes: {
                    theme: "theme",
                    addon: "add_on"
                },

                licenseTypes: {
                    standard: "Standard",
                    mit: "MIT",
                    gpl: "GPL",
                    custom: "Custom"
                },

                supportPlans: {
                    no: 1,
                    repliesOnceAWeek: 8,
                    repliesEveryFewDays: 12,
                    repliesEveryBusinessDay: 16,
                    giveMeAccessAndIWillLoginToYourSite: 50
                },

                skillLevels: {
                    beginner: "Beginner",
                    intermediate: "Intermediate",
                    expert: "Expert",
                    bleedingEdge: "Bleeding Edge"
                },

                themeCategories: {
                    artistic: 18,
                    gritty: 19,
                    colorful: 20,
                    corporate: 52,
                    eCommerce: 472,
                    realEstate: 1997,
                    clean: 2433,
                    portfolioAndDesign: 2536,
                    photographer: 2537,
                    html5AndCss3: 2538,
                    photoBackground: 7154,
                    blog: 7156,
                    magazine: 7157,
                    retail: 7158,
                    technology: 7159,
                    nonProfit: 7160,
                    entertainment: 7161,
                    mobile: 7163,
                    framework: 7164,
                    bright: 7165,
                    dark: 7166,
                    elegant: 7167,
                    education: 7168,
                    responsive: 12489
                },


                addonCategories: {
                    applications: 16,
                    audienceContribution: 44,
                    customTemplates: 1404,
                    developerTools: 1273,
                    digitalAssetManagment: 15,
                    eCommerce: 43,
                    imageGalleries: 42,
                    imageSliders: 49,
                    interfaceElements: 41,
                    multimedia: 50,
                    seoAndStatistics: 49,
                    socialNetworking: 51,
                    spamCaptcha: 12590,
                    systemUtilities: 45
                }
            },

            init: function () {
                this.cheerio = require('cheerio');
                this.request = require('request').defaults({jar: true});
                this.fs = require('fs');
                this.sprintf = require('sprintf-js').sprintf;
                this.path = require('path');
            },

            getBaseDir: function () {
                return this.path.join(__dirname, '../../../');
            },

            setDone: function (done) {
                this.done = done;
            },

            setConfig: function (config) {
                this.config = config;
            },

            validators: {
                isValidString: function (variable) {
                    return typeof variable === "string" && variable.length > 0;
                },

                isValidBoolean: function (variable) {
                    return typeof variable === "boolean" || (typeof variable === "number" && (variable === 0 || variable === 1));
                },

                isNumber: function (variable) {
                    return typeof variable === "number";
                },

                isValidFile: function (variable) {
                    return variable !== "" && grunt.file.exists(concretePackageUploader.getBaseDir() + variable);
                }
            },

            helpers: {
                getKeys: function (variable) {
                    return Object.keys(variable);
                },

                getValues: function (variable) {
                    var values = [];

                    for (var key in variable) {
                        values.push(variable[key]);
                    }

                    return values;
                }
            },

            checkRequiredFields: function (options) {
                for (var fieldName in options.fields) {
                    var validatorSettings = options.fields[fieldName];

                    if (validatorSettings.validator(options.bag[fieldName]) === false) {
                        this.raiseError(this.sprintf("Field '%s' is missing or invalid.", fieldName));
                    }

                }

                return true;
            },

            setDefaults: function () {
                if (typeof this.config.packageInformations.singlePrice !== "undefined" &&
                    typeof this.config.packageInformations.fivePrice === "undefined") {

                    this.config.packageInformations.fivePrice = this.config.packageInformations.singlePrice * 4;
                }

                for (var keyName in this.defaults) {
                    var defaultValue = this.defaults[keyName];

                    if (typeof this.config.packageInformations[keyName] === "undefined") {
                        this.config.packageInformations[keyName] = defaultValue;
                    }
                }
            },

            validate: function () {
                var self = this;

                return this.checkRequiredFields({
                    bag: this.config.credentials,

                    fields: {
                        'username': {
                            'validator': this.validators.isValidString
                        },
                        'password': {
                            'validator': this.validators.isValidString
                        },
                    }
                }) && this.checkRequiredFields({
                    bag: this.config.packageInformations,

                    fields: {
                        'packageHandle': {
                            'validator': this.validators.isValidString
                        },
                        'productType': {
                            'validator': function (variable) {
                                var availableOptions = self.helpers.getValues(self.enums.productTypes);

                                return availableOptions.indexOf(variable) !== -1;
                            }
                        },
                        'title': {
                            'validator': this.validators.isValidString
                        },
                        'shortDescription': {
                            'validator': this.validators.isValidString
                        },
                        'description': {
                            'validator': this.validators.isValidString
                        },
                        'keywords': {
                            'validator': this.validators.isValidString
                        },
                        'singlePrice': {
                            'validator': function (variable) {
                                if (self.validators.isNumber(variable)) {
                                    return (variable === 0 || variable >= 15);
                                } else {
                                    return false;
                                }
                            }
                        },
                        'fivePrice': {
                            'validator': this.validators.isNumber
                        },
                        'requiredVersion': {
                            'validator': function (variable) {
                                //var availableOptions = ["5.7.0.4", "5.7.1", "5.7.2", "5.7.2.1", "5.7.3", "5.7.3.1", "5.7.4", "5.7.4.1", "5.7.4.2", "5.7.5", "5.7.5.1", "5.7.5.10", "5.7.5.11", "5.7.5.12", "5.7.5.13", "5.7.5.2", "5.7.5.3", "5.7.5.4", "5.7.5.5", "5.7.5.6", "5.7.5.7", "5.7.5.8", "5.7.5.9", "8.0.0", "8.0.1", "8.0.2", "8.0.3", "8.1.0", "8.2.0", "8.2.1"];
                                //return availableOptions.indexOf(variable) !== -1;
                                return true;
	                    }
                        },
                        'version': {
                            'validator': this.validators.isValidString
                        },
                        'packageFile': {
                            'validator': this.validators.isValidFile
                        },
                        'licenseType': {
                            'validator': function (variable) {
                                var availableOptions = self.helpers.getValues(self.enums.licenseTypes);

                                return availableOptions.indexOf(variable) !== -1;
                            }
                        },
                        'supportPlan': {
                            'validator': function (variable) {
                                var availableOptions = [1, 8, 12, 16, 50];

                                return availableOptions.indexOf(variable) !== -1;
                            }
                        },
                        'supportHostedOffsite': {
                            'validator': this.validators.isValidBoolean
                        },
                        'skillLevel': {
                            'validator': function (variable) {
                                var availableOptions = self.helpers.getValues(self.enums.skillLevels);

                                return availableOptions.indexOf(variable) !== -1;
                            }
                        },
                        'categories': {
                            'validator': function (variable) {
                                var availableOptions;

                                if (self.config.packageInformations.productType === self.enums.productTypes.addon) {
                                    availableOptions = self.helpers.getValues(self.enums.addonCategories);
                                } else {
                                    availableOptions = self.helpers.getValues(self.enums.themeCategories);
                                }

                                for (var i in variable) {
                                    if (availableOptions.indexOf(variable[i]) === -1) {
                                        return false;
                                    }
                                }

                                return true;
                            }
                        },
                        'pageTypes': {
                            'validator': function (variable) {
                                if (self.config.packageInformations.productType === self.enums.productTypes.theme) {
                                    return self.validators.isValidString(variable)
                                } else {
                                    return true;
                                }

                            }
                        },
                        'customizableStyles': {
                            'validator': function (variable) {
                                if (self.config.packageInformations.productType === self.enums.productTypes.theme) {
                                    return self.validators.isValidBoolean(variable)
                                } else {
                                    return true;
                                }

                            }
                        },
                        'themeThumbnail': {
                            'validator': function (variable) {
                                if (self.config.packageInformations.productType === self.enums.productTypes.theme) {
                                    return self.validators.isValidFile(variable)
                                } else {
                                    return true;
                                }

                            }
                        }
                    }
                });
            },

            login: function (options) {
                var self = this;

                self.doGet({
                    url: "https://www.concrete5.org/login",

                    onSuccess: function ($dom) {
                        self.doPost({
                            url: "https://www.concrete5.org/login/-/do_login/",

                            postParams: {
                                "uName": self.config.credentials.username,
                                "uPassword": self.config.credentials.password,
                                "ccm_token": $dom("input[name=ccm_token]").val()
                            },

                            onSuccess: function ($dom) {
                                if ($dom(".alert-error").length) {
                                    options.onError(self.parseResponseError($dom(".alert-error > span").text()));
                                } else {
                                    options.onSuccess();
                                }

                            },

                            onError: options.onError
                        });
                    },

                    onError: options.onError
                });
            },

            logout: function (options) {
                this.doGet({
                    url: "https://www.concrete5.org/login/-/logout/",
                    onSuccess: options.onSuccess,
                    onError: options.onError
                });
            },

            detectPackage: function (options) {
                var self = this;

                self.doGet({
                    url: "http://www.concrete5.org/profile/marketplace/",

                    onSuccess: function ($dom) {
                        var editProfileUrl = "http://www.concrete5.org" + $dom("a:contains('Public Profile')").attr("href");

                        self.doGet({
                            url: editProfileUrl,

                            onSuccess: function ($dom) {
                                var editAddonPath = $dom("img[title='" + self.config.packageInformations.title + "']").parent().attr("href");

                                if (self.validators.isValidString(editAddonPath)) {
                                    if (editAddonPath.indexOf("review_pending") > 0) {
                                        // In Review
                                        self.doGet({
                                            url: "http://www.concrete5.org" + editAddonPath,

                                            onSuccess: function ($dom) {
                                                options.onSuccess({
                                                    updatePageUrl: "http://www.concrete5.org" + $dom("#search-grid-search-form ul li a:contains('Listing')").attr("href"),
                                                    updateFilesUrl: "http://www.concrete5.org" + $dom("#search-grid-search-form ul li a:contains('Files')").attr("href")
                                                });
                                            },

                                            onError: options.onError
                                        });
                                    } else {
                                        self.doGet({
                                            url: "http://www.concrete5.org" + editAddonPath,

                                            onSuccess: function ($dom) {
                                                editAddonPath = $dom(".info-author a:contains('Edit')").attr("href");

                                                if (self.validators.isValidString(editAddonPath)) {
                                                    self.doGet({
                                                        url: "http://www.concrete5.org" + editAddonPath,

                                                        onSuccess: function ($dom) {
                                                            options.onSuccess({
                                                                updatePageUrl: "http://www.concrete5.org" + $dom("#search-grid-search-form ul li a:contains('Listing')").attr("href"),
                                                                updateFilesUrl: "http://www.concrete5.org" + $dom("#search-grid-search-form ul li a:contains('Files')").attr("href")
                                                            });
                                                        },

                                                        onError: options.onError
                                                    });

                                                } else {
                                                    options.onSuccess(null);
                                                }
                                            },

                                            onError: options.onError

                                        });

                                    }

                                } else {
                                    options.onSuccess(null);
                                }
                            },

                            onError: options.onError
                        });
                    },

                    onError: options.onError
                });
            },

            update: function (options) {
                var self = this;

                this.detectPackage({
                    onSuccess: function (package) {
                        if (package === null) {
                            self.createPackage(options);

                        } else {
                            options.package = package;

                            self.updatePackage(options);
                        }

                    },

                    onError: options.onError
                });
            },

            updatePackage: function (options) {
                var self = this;

                // Update package file
                self.doGet({
                    url: options.package.updateFilesUrl,

                    onSuccess: function ($dom) {
                        var postParams = {
                            "ccm_token": $dom("input[name=ccm_token]").val(),
                            "mpID": $dom("input[name=mpID]").val(),
                            "addonVersion": self.config.packageInformations.version,
                            "file": self.getFileStream(self.config.packageInformations.packageFile),
                            "mpfNotes": self.config.packageInformations.notes
                        };

                        self.doPostMultipart({
                            url: "http://www.concrete5.org/marketplace/manage_files/-/submit_file/",

                            postParams: postParams,

                            onSuccess: function ($dom) {
                                if ($dom(".alert-danger").length) {
                                    options.onError(self.parseResponseError($dom(".alert-danger").text()));
                                } else {
                                    // Update details and marketplace page
                                    self.doGet({
                                        url: options.package.updatePageUrl,

                                        onSuccess: function ($dom) {
                                            var screenshots = [];

                                            for (var i in self.config.packageInformations.screenshots) {
                                                screenshots.push(self.getFileStream(self.config.packageInformations.screenshots[i]));
                                            }

                                            var postParams = {
                                                "ccm_token": $dom("input[name=ccm_token]").val(),
                                                "mpiCID": $dom("input[name=mpiCID]").val(),
                                                "marketplace": 1,
                                                "title": self.config.packageInformations.title,
                                                "description": self.config.packageInformations.shortDescription,
                                                "bodyContent": self.config.packageInformations.description,
                                                "addon_keywords": self.config.packageInformations.keywords,
                                                "exampleURL": self.config.packageInformations.exampleUrl,
                                                "screencast": self.config.packageInformations.screencast,
                                                "screenshotsUploads[]": screenshots,
                                                "price": self.config.packageInformations.singlePrice,
                                                "price5": self.config.packageInformations.fivePrice,
                                                "purchaseMessage": self.config.packageInformations.purchaseMessage,
                                                "license_type": self.config.packageInformations.licenseType,
                                                "license_text": self.config.packageInformations.licenseText,
                                                "support_plan": self.config.packageInformations.supportPlan,
                                                "support_hosted_offsite": self.config.packageInformations.supportHostedOffsite ? 1 : 0,
                                                "support_hosted_offsite_url": self.config.packageInformations.supportHostedOffsiteUrl,
                                                "skillLevel": self.config.packageInformations.skillLevel,
                                                "customizableStyles": self.config.packageInformations.customizableStyles ? 1 : 0,
                                                //"marketplaceItem": "",
                                                "pageTypes": self.config.packageInformations.pageTypes,
                                                "themeThumbnail": self.getFileStream(self.config.packageInformations.themeThumbnail),
                                                "versionHistoryPageContent": self.config.packageInformations.versionHistory
                                            };

                                            if (self.config.packageInformations.dependencies.length > 0) {
                                                for (var i in self.config.packageInformations.dependencies) {
                                                    var dependencyId = self.config.packageInformations.dependencies[i];

                                                    postParams["akID[124][mpID][" + dependencyId + "]"] = dependencyId;
                                                }
                                            }

                                            self.doPostMultipart({
                                                url: "http://www.concrete5.org/marketplace/manage_item/-/edit/",

                                                postParams: postParams,

                                                onSuccess: function ($dom) {
                                                    if ($dom(".alert-danger").length) {
                                                        options.onError(self.parseResponseError($dom(".alert-danger").text()));
                                                    } else {
                                                        options.onSuccess();
                                                    }
                                                },

                                                onError: options.onError
                                            });


                                        },

                                        onError: options.onError
                                    });
                                }
                            },

                            onError: options.onError
                        });

                    },

                    onError: options.onError
                });
            },

            getFileStream: function (filePath) {
                if (filePath === "") {
                    return "";
                } else {
                    return this.fs.createReadStream(this.getBaseDir() + "/" + filePath);
                }
            },

            createPackage: function (options) {
                var self = this;

                self.doGet({
                    url: "http://www.concrete5.org/marketplace/manage_item/-/submit_marketplace_id/",

                    onSuccess: function ($dom) {
                        var screenshots = [];

                        for (var i in self.config.packageInformations.screenshots) {
                            screenshots.push(self.getFileStream(self.config.packageInformations.screenshots[i]));
                        }

                        var postParams = {
                            "ccm_token": $dom("input[name=ccm_token]").val(),
                            "mpiCID": 0,
                            "marketplace": 1,
                            "productType": self.config.packageInformations.productType,
                            "title": self.config.packageInformations.title,
                            "packageHandle": self.config.packageInformations.packageHandle,
                            "description": self.config.packageInformations.shortDescription,
                            "bodyContent": self.config.packageInformations.description,
                            "addon_keywords": self.config.packageInformations.keywords,
                            "exampleURL": self.config.packageInformations.exampleUrl,
                            "screencast": self.config.packageInformations.screencast,
                            "screenshotsUploads": screenshots,
                            "price": self.config.packageInformations.singlePrice,
                            "price5": self.config.packageInformations.fivePrice,
                            "purchaseMessage": self.config.packageInformations.purchaseMessage,
                            "c5version": self.config.packageInformations.requiredVersion,
                            "version": self.config.packageInformations.version,
                            "packageUpload": self.getFileStream(self.config.packageInformations.packageFile),
                            "license_type": self.config.packageInformations.licenseType,
                            "license_text": self.config.packageInformations.licenseText,
                            "support_plan": self.config.packageInformations.supportPlan,
                            "support_hosted_offsite": self.config.packageInformations.supportHostedOffsite ? 1 : 0,
                            "support_hosted_offsite_url": self.config.packageInformations.supportHostedOffsiteUrl,
                            "offers_paid_support": self.config.packageInformations.offersPaidSupport,
                            "support_price": self.config.packageInformations.supportPrice,
                            "pageTypes": self.config.packageInformations.pageTypes,
                            "customizableStyles": self.config.packageInformations.customizableStyles ? 1 : 0,
                            "themeThumbnail": self.getFileStream(self.config.packageInformations.themeThumbnail),
                            "skillLevel": self.config.packageInformations.skillLevel,
                            "agree_to_terms": 1,
                            "containsPageTypes": self.config.packageInformations.containsPageTypes,
                            "isPackageFormat": 1,
                            "containsPageTypes": 1,
                            "versionHistoryPageContent": self.config.packageInformations.versionHistory
                        };

                        if (self.config.packageInformations.productType === self.enums.productTypes.theme) {
                            for (var i in self.config.packageInformations.categories) {
                                var categoryId = self.config.packageInformations.categories[i];

                                postParams["akID[50][atSelectOptionID][" + categoryId + "]"] = categoryId;
                            }
                        } else {
                            for (var i in self.config.packageInformations.categories) {
                                var categoryId = self.config.packageInformations.categories[i];

                                postParams["akID[49][atSelectOptionID][" + categoryId + "]"] = categoryId;
                            }
                        }

                        if (self.config.packageInformations.dependencies.length > 0) {
                            for (var i in self.config.packageInformations.dependencies) {
                                var dependencyId = self.config.packageInformations.dependencies[i];

                                postParams["akID[124][mpID][" + dependencyId + "]"] = dependencyId;
                            }
                        }

                        self.doPostMultipart({
                            url: "http://www.concrete5.org/marketplace/manage_item/-/add/",

                            postParams: postParams,

                            onSuccess: function ($dom) {
                                if ($dom(".alert-danger").length) {
                                    options.onError(self.parseResponseError($dom(".alert-danger").text()));
                                } else {
                                    options.onSuccess();
                                }
                            },

                            onError: options.onError
                        });

                    },

                    onError: options.onError
                });
            },

            parseResponseError: function (text) {
                var formattedText = "";

                var lines = text.split("\n");

                for (var i in lines) {
                    var line = lines[i];

                    formattedText += line.trim() + "\n";
                }

                return formattedText;
            },

            doGet: function (options) {
                var self = this;

                this.request({
                    url: options.url,
                    method: "GET"
                }, function (error, response, body) {
                    if (error) {
                        options.onError(error);
                    } else {
                        options.onSuccess(self.cheerio.load(body));
                    }
                });
            },

            doPost: function (options) {
                var self = this;

                this.request.post({
                    url: options.url,
                    method: "POST",
                    form: options.postParams
                }, function (error, response, body) {
                    if (error) {
                        options.onError(error);
                    } else {
                        options.onSuccess(self.cheerio.load(body));
                    }
                });
            },

            doPostMultipart: function (options) {
                var self = this;

                this.request.post({
                    url: options.url,
                    method: "POST",
                    formData: options.postParams
                }, function (error, response, body) {
                    if (error) {
                        options.onError(error);
                    } else {
                        options.onSuccess(self.cheerio.load(body));
                    }
                });
            },

            logMessage: function (message) {
                grunt.log.writeln(message);
            },

            raiseError: function (errorMessage) {
                grunt.log.error(errorMessage);

                this.exitTask();
            },

            exitTask: function () {
                this.done();
            },

            startTask: function (options) {
                this.init();

                this.setConfig(options.config);
                this.setDone(options.done);

                this.setDefaults();

                if (this.validate()) {
                    var self = this;

                    self.login({
                        onSuccess: function () {
                            self.update({
                                onSuccess: function () {
                                    self.logout({
                                        onSuccess: function () {
                                            self.logMessage("The Package was successfully updated.");

                                            self.exitTask();
                                        },

                                        onError: function (errorMessage) {
                                            self.raiseError(errorMessage);
                                        }
                                    });
                                },

                                onError: function (errorMessage) {
                                    self.raiseError(errorMessage);
                                }
                            });
                        },

                        onError: function (errorMessage) {
                            self.raiseError(errorMessage);
                        }
                    });

                }
            }
        };

        concretePackageUploader.startTask({
            config: grunt.config.getRaw("concrete_package_uploader"),
            done: this.async()
        });
    });
};
