import { create } from 'zustand';
import { IRoomData } from '../common/types';
import { produce } from 'immer';

interface State {
  currentRoomInfo: IRoomData;
  setCurrentRoomInfo: (T: IRoomData) => void;
  updateMembersInCurrentRoom: (T: IRoomData['members']) => void;
}

const useStore = create<State>((set) => ({
    currentRoomInfo: {} as IRoomData,
    setCurrentRoomInfo: (data) => set(() => ({ currentRoomInfo: data })),
    updateMembersInCurrentRoom: (data) =>
      set(
        produce((state) => {
          state.currentRoomInfo.members = [...state.currentRoomInfo.members, ...data];
        }),
      ),
}));

export default useStore;
