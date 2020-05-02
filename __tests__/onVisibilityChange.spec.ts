import { didVisibilityChange, visibility } from '../src/onVisibilityChange';

describe('onVisibilityChange', () => {
  beforeEach(() => {
    visibility.isHidden = false;
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
