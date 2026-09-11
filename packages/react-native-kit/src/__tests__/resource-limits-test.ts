import { getComputeUnitLimitFromEstimate } from '../resource-limits';

describe('getComputeUnitLimitFromEstimate', () => {
    it('adds at least 300 compute units to small estimates', () => {
        expect(getComputeUnitLimitFromEstimate(0)).toBe(300);
        expect(getComputeUnitLimitFromEstimate(1_000)).toBe(1_300);
    });

    it('adds a relative margin that shrinks from 10% towards 2% as the estimate grows', () => {
        // 10,000 CU: margin is just under 10%.
        expect(getComputeUnitLimitFromEstimate(10_000)).toBe(10_984);
        // 500,000 CU and up: margin is 2%.
        const large = getComputeUnitLimitFromEstimate(600_000);
        expect(large).toBeGreaterThanOrEqual(612_000);
        expect(large).toBeLessThanOrEqual(612_001);
    });

    it('never exceeds the runtime maximum of 1,400,000 compute units', () => {
        expect(getComputeUnitLimitFromEstimate(1_400_000)).toBe(1_400_000);
        expect(getComputeUnitLimitFromEstimate(2_000_000)).toBe(1_400_000);
    });
});
