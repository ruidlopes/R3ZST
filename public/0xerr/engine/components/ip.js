const NO_IP = [0, 0, 0, 0];

class IpComponent {
  constructor(ip = NO_IP) {
    this.ip = ip;
  }
}

export {
  IpComponent,
  NO_IP,
};