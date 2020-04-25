import { WP } from '../src/constants';
import {
  didVisibilityChange,
  onVisibilityChange,
  visibility,
} from '../src/onVisibilityChange';
import mock from './_mock';

describe('onVisibilityChange', () => {
  let spy;

  beforeEach(() => {
    visibility.isHidden = false;
  });

  describe('.onVisibilityChange()', () => {
    it('should not call document.addEventListener() when document.hidden is undefined', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(undefined as any);
      onVisibilityChange(() => {});
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call document.addEventListener() with the correct argument', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      onVisibilityChange(() => {});
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.didVisibilityChange()', () => {
    it('should keep "hidden" default value when is false', () => {
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      didVisibilityChange(() => {});
      expect(visibility.isHidden).toEqual(false);
    });

    it('should set "hidden" value when is true', () => {
      visibility.isHidden = false;
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      didVisibilityChange(() => {});
      expect(visibility.isHidden).toEqual(true);
    });

    it('should keep "hidden" value when changes to false', () => {
      visibility.isHidden = true;
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      didVisibilityChange(() => {});
      expect(visibility.isHidden).toEqual(true);
    });
  });
});
