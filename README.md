# grunt-concrete-package-uploader

> Automatically deploy packages to concrete5.org

This grunt plug-in automatically deploys concrete5 themes + add-ons to the cocnrete5.org Marketplace. This plugin allows to upload complety new packages and also to update existing packages.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-concrete-package-uploader --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-concrete-package-uploader');
```

## The "concrete_package_uploader" task

### Overview
In your project's Gruntfile, add a section named `concrete_package_uploader` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  concrete_package_uploader: {
    // Task-specific options go here.
  },
});
```

### Options

#### credentials.username
Type: `String`

Default value: ``

Required: Yes

-

Username of your concrete5.org user account.

#### credentials.password
Type: `String`

Default value: ``

Required: Yes

-

Password of your concrete5.org user account.


#### packageInformations.productType
Type: `String`

Default value: `add_on`

Required: Yes

-

You can use on of these values:

| Value  |
|--------|
| add_on |
| theme  |

#### packageInformations.packageHandle
Type: `String`

Default value: `(Empty)`

Required: Yes

#### packageInformations.shortDescription
Type: `String`

Default value: `(Empty)`

Required: Yes

#### packageInformations.description
Type: `String`

Default value: `(Empty)`

Required: Yes

#### packageInformations.keywords
Type: `String`

Default value: `(Empty)`

Required: Yes

#### packageInformations.exampleUrl
Type: `String`

Default value: `(Empty)`

Required: No

#### packageInformations.screencast
Type: `String`

Default value: `(Empty)`

Required: No

#### packageInformations.dependencies
Type: `Array`

Default value: `(Empty)`

Required: No

-

Array with marketplace ids of required add-ons.

#### packageInformations.singlePrice
Type: `Number`

Default value: `0`

Required: Yes

-

Leave this 0 for free or at least $15.

#### packageInformations.fivePrice
Type: `Number`

Default value: `0`

Required: Yes

-

If you set a single price and leave this field empty this field will be the quadruple of the single price.

#### packageInformations.purchaseMessage
Type: `String`

Default value: `Thank you for your purchase. If you take the time to submit a review, I'd love to give you a 10% discount on the next copy of this you purchase.`

Required: Yes

#### packageInformations.requiredVersion
Type: `String`

Default value: `5.7.0.4`

Required: Yes

-

You can use one of the following values:

| Value    |
|----------|
| 5.7.0.4  |
| 5.7.1    |
| 5.7.2    |
| 5.7.2.1  |
| 5.7.3    |
| 5.7.3.1  |
| 5.7.4    |
| 5.7.4.1  |
| 5.7.4.2  |
| 5.7.5    |
| 5.7.5.1  |
| 5.7.5.10 |
| 5.7.5.11 |
| 5.7.5.12 |
| 5.7.5.13 |
| 5.7.5.2  |
| 5.7.5.3  |
| 5.7.5.4  |
| 5.7.5.5  |
| 5.7.5.6  |
| 5.7.5.7  |
| 5.7.5.8  |
| 5.7.5.9  |
| 8.0.0    |
| 8.0.1    |
| 8.0.2    |
| 8.0.3    |
| 8.1.0    |
| 8.2.0    |
| 8.2.1    |

#### packageInformations.version
Type: `String`

Default value: `1.0`

Required: No

-

Before submitting to marketplace version number should be 0.9.

#### packageInformations.packageFile
Type: `String`

Default value: `(Empty)`

Required: Yes

-

Expects a file path.

#### packageInformations.licenseType
Type: `String`

Default value: `Standard`

Required: Yes

-

You can use one of the following values:

| Value    |
|----------|
| Standard |
| MIT      |
| GPL      |
| Custom   |

#### packageInformations.licenseText
Type: `String`

Default value: `(Empty)`

Required: No

-

This field is only required when you have setted the license type to "Custom".

#### packageInformations.supportPlan
Type: `Number`

Default value: `1`

Required: Yes

-

You can use one of the following values:

| Name                                         | Value |
|----------------------------------------------|-------|
| No                                           | 1     |
| Replies tickets once a week.                 | 8     |
| Replies tickets every few days.              | 12    |
| Replies tickets every business day.          | 16    |
| Give me access and i will login to your site | 50    |

#### packageInformations.supportHostedOffsite
Type: `Boolean`

Default value: `false`

Required: Yes

#### packageInformations.supportHostedOffsiteUrl
Type: `String`

Default value: `(Empty)`

Required: No

#### packageInformations.offersPaidSupport
Type: `String`

Default value: `(Empty)`

Required: Yes

#### packageInformations.supportPrice
Type: `Number`

Default value: `(Empty)`

Required: No

#### packageInformations.pageTypes
Type: `String`

Default value: `(Empty)`

Required: No

-

Only required for themes.

#### packageInformations.customizableStyles
Type: `Boolean`

Default value: false

Required: No

-

Only required for themes.

#### packageInformations.skillLevel
Type: `String`

Default value: `Beginner`

Required: Yes

-

You can use one of the following values:

| Name          |
|---------------|
| Beginner      |
| Intermediate  |
| Expert        |
| Bleeding Edge |

#### packageInformations.containsPageTypes
Type: `String`

Default value: `(Empty)`

Required: No

-

Only required for themes.

#### packageInformations.versionHistory
Type: `String`

Default value: `(Empty)`

Required: No

#### packageInformations.themeThumbnail
Type: `String`

Default value: `(Empty)`

Required: No

-

Only required for themes. Expects a file path.



#### packageInformations.notes
Type: `String`

Default value: `(Empty)`

Required: No

#### packageInformations.screenshots
Type: `Array`

Default value: `(Empty)`

Required: No

-

Expects an array of file pathes.

#### packageInformations.categories
Type: `Array`

Default value: `(Empty)`

Required: Yes

For add-ons you can use 1-3 values of the following table:

| Name                    | Value |
|-------------------------|-------|
| Applications            | 16    |
| Audience Contribution   | 44    |
| Custom Templates        | 1404  |
| Developer Tools         | 1273  |
| Digital Asset Managment | 15    |
| eCommerce               | 43    |
| Image Galleries         | 42    |
| Image Sliders           | 49    |
| Interface Elements      | 41    |
| Multimedia              | 50    |
| SEO and Statistics      | 49    |
| Social Networking       | 51    |
| SPAM Captcha            | 12590 |
| System Utilities        | 45    |

For themes you can use 1-3 values of the following table:

| Name                 | Value |
|----------------------|-------|
| Artistic             | 18    |
| Gritty               | 19    |
| Colorful             | 20    |
| Corporate            | 52    |
| eCommerce            | 472   |
| Real Estate          | 1997  |
| Clean                | 2433  |
| Portfolio and Design | 2536  |
| Photographer         | 2537  |
| HTML5 and CSS3       | 2538  |
| Photo Background     | 7154  |
| Blog                 | 7156  |
| Magazine             | 7157  |
| Retail               | 7158  |
| Technology           | 7159  |
| Non Profit           | 7160  |
| Entertainment        | 7161  |
| Mobile               | 7163  |
| Framework            | 7164  |
| Bright               | 7165  |
| Dark                 | 7166  |
| Elegant              | 7167  |
| Education            | 7168  |
| Responsive           | 12489 |

### Usage Example

```js
grunt.config.init({
	concrete_package_uploader: {
		credentials: {
			username: "your_username",
			password: "your_password"
		},

		packageInformations: {
			packageHandle: "your_package_handle",
			packageFile: "build/your_package_file.zip",
			title: "My package",
			version: '0.9.0',
			singlePrice: 15,
			keywords: 'some, keywords',
			shortDescription: 'This is a short description.',
			description: 'This is a long description.',
			categories: [16, 50],
			screenshots: ["screenshots/1.png", "screenshots/2.png"]
		}
	}
});

grunt.registerTask('default', ['concrete_package_uploader']);
```
