interface Flavoring<Kind extends string> {
  readonly __kind__?: Kind;
}

interface Branding<Base, Kind extends string> {
  readonly __base__: Base;
  readonly __kind__: Kind;
}

type Flavor<Base, Kind extends string> = Base & Flavoring<Kind>;
type Brand<Base, Kind extends string> = Base & Branding<Base, Kind>;

type AnyBrand = Brand<unknown, string>
type BaseOf<B extends AnyBrand> = B['__base__'];

type Brander<Brand extends AnyBrand> = (value: BaseOf<Brand>) => Brand;
type BrandValidator<Brand extends AnyBrand> = (value: BaseOf<Brand>) => void;

function make<Brand extends AnyBrand>(validator?: BrandValidator<Brand>): Brander<Brand> {
  return function (value: BaseOf<Brand>): Brand {
    if (validator) {
      validator(value);
    }

    return value as Brand;
  };
}

export type { Flavor, Brand, Brander };
export { make };
