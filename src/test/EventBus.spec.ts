import {EventBus, Subscribe} from '../ts/index';

describe('Event Tests', () => {
    class SyncEvent extends EventBus.Event<number> {}
    class DataEvent extends EventBus.Event<string> {}

    class Activity {
        data!: string;
        constructor() {
            EventBus.getDefault().register(this);
        }

        onSyncEvent(data: number): void {
        }

        @Subscribe('SyncEvent')
        onEvent(data: number): void {
            this.onSyncEvent(data);
        }

        @Subscribe('DataEvent')
        onDataEvent(data: string): void {
            this.data = data;
        }
    }

    let activity: Activity;

    beforeAll(() => {
        activity = new Activity();
        spyOn(activity, 'onSyncEvent').and.callThrough();
    });

    it('getDefault should return the EventBus instance', () => {
        expect(EventBus.getDefault()).toBeDefined();
    });

    it('register should add the observer', () => {
        expect(EventBus.getDefault().observers.length).toEqual(1);
    });

    it('unregister should remove the observer', () => {
        let observer: any = {};
        EventBus.getDefault().register(observer);

        let count: number = EventBus.getDefault().observers.length;
        EventBus.getDefault().unregister(observer);

        expect(EventBus.getDefault().observers.length).toEqual(count - 1);
    });

    it('post should propagate the event', () => {
        EventBus.getDefault().post(new SyncEvent(5));
        expect(activity.onSyncEvent).toHaveBeenCalled();
    });

    it('post should propagate the event data', () => {
        EventBus.getDefault().post(new SyncEvent(123123));
        expect(activity.onSyncEvent).toHaveBeenCalledWith(123123);
    });

    it('post DataEvent should propagate the data', () => {
        EventBus.getDefault().post(new DataEvent('testData'));
        expect(activity.data).toEqual('testData');
    });
});
