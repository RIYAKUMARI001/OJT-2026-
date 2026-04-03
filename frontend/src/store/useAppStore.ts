import { create } from 'zustand';

export interface RoomData {
  roomType: string;
  width: number;
  length: number;
  wallColor: string;
}

interface AppState {
  room: RoomData;
  placedItems: string[];
  setRoomType: (type: string) => void;
  setDimensions: (width: number, length: number) => void;
  setWallColor: (color: string) => void;
  addPlacedItem: (name: string) => void;
  undoPlaced: () => void;
  resetPlaced: () => void;
  loadSavedDesign: (room: RoomData, items: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  room: {
    roomType: "Living Room",
    width: 12,
    length: 14,
    wallColor: "#F5F0E8",
  },
  placedItems: [],
  setRoomType: (type) => set((state) => ({ room: { ...state.room, roomType: type } })),
  setDimensions: (width, length) => set((state) => ({ room: { ...state.room, width, length } })),
  setWallColor: (color) => set((state) => ({ room: { ...state.room, wallColor: color } })),
  addPlacedItem: (name) =>
    set((state) => ({ placedItems: [...state.placedItems, name] })),
  undoPlaced: () =>
    set((state) => ({
      placedItems: state.placedItems.slice(0, -1),
    })),
  resetPlaced: () => set({ placedItems: [] }),
  loadSavedDesign: (room, items) =>
    set({
      room: { ...room },
      placedItems: [...items],
    }),
}));
