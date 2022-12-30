<p align="center">
  <img src="logo.png" with="300" height="300" alt="type-brandy" />
</p>
<hr>

## About this package
With `ts-branding` package You can achieve [nominal typing](https://basarat.gitbook.io/typescript/main-1/nominaltyping) by leveraging a technique that is called "type branding" in TypeScript world. This works by intersecting a base type with a object type with a non-existent property. It's very similar to Flow's [opaque type aliases](https://flow.org/en/docs/types/opaque-types/).
## Why type branding is important?
Let's say You have two types (they could be numbers, strings or even objects) that are structurally equal but are used for different things in your code. For example - number could be a user id, a phone number or tracking number. Many other things, maybe even used for security. To a structural type system there is no way to say that this function should only work on user ids and not be allowed to received other numbers that could result it getting data for the wrong user. People tend to make mistakes, but we can make our lives a little better. We can make it so a user id is not equal to every other number in our application.
## Flavoring vs branding
Both methods are useful. But in practice, flavoring is more often applicable. It is useful in the following cases:
* You want to allow implicit conversion of composite-structures which are from trusted sources, but want to use semantic subtypes.
* You wish to trace a category or source of a simple value, but aren’t willing to sign up for the friction of casting or using functions to “bless” values explicitly in all of your unit tests, etc. Good example - units of measure.
* You want to annotate the type of an argument with semantic information in a way that TypeScript can trace for you and make visible in e.g. editor tooltips while still using simple types at runtime.

Branding also has its uses. We will use the stricter approach when:
* We want to write code that can safely assume that some data validation has occurred. For example - `IsoDate` type which must be a valid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date string.
* A type error admitted by implicit conversion could lead to a dangerous error, such as when using types to access tokens for authorization.
## Installation

```bash
$ npm install type-brandy --save-dev
$ yarn add type-brandy --dev
$ pnpm add type-brandy --save-dev
```

## Usage examples
### Flavoring

```ts
import { Flavor } from 'type-brandy';

type UserId = Flavor<number, 'User'>;
type BlogId = Flavor<number, 'Blog'>;

function getUserById(userId: UserId) {
  return User.findOne({ _id: userId });
}

const blogId: BlogId = 1000;      // OK
const userId: UserId = 2000;      // OK

const user = getUserById(blogId); // Compile time error
```

### Branding

```ts
import { Brand, make } from 'type-brandy';

type IsoDate = Brand<string, 'IsoDate'>;

const IsoDate = make<IsoDate>((value: string) => {
  if (new Date(value).toJSON() !== value) {
    throw new TypeError('invalid ISO 8601 date string');
  }
});

// Throws compile time error
const date1: IsoDate = '2000-01-01T00:00:00.000Z';
// Throws runtime error
const date3: IsoDate = IsoDate('9999-99-99T99:99:99.999Z');
// Compilation would be successful
const date2: IsoDate = IsoDate('2000-01-01T00:00:00.000Z');
```
