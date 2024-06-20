import { DummyService } from "../services/dummy.service";

class DummyController {

  constructor(private readonly dummyService: DummyService) { }

  // Your controller methods here
}

export { DummyController };