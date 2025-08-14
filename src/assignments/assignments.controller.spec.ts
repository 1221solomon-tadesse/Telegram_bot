import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;
  let service: AssignmentsService;

  const mockAssignmentsService = {
    assignQuestion: jest.fn((userId, faqId) => Promise.resolve({
      id: 1,
      user: { id: userId, name: 'Test User', email: 'test@example.com' },
      faq: { id: faqId, question: 'Test Question', answer: null },
      answered: false,
    })),
    markAsAnswered: jest.fn((id) => Promise.resolve({
      id,
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      faq: { id: 1, question: 'Test Question', answer: null },
      answered: true,
    })),
    findAll: jest.fn(() => Promise.resolve([
      {
        id: 1,
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        faq: { id: 1, question: 'Test Question', answer: null },
        answered: false,
      },
    ])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [
        {
          provide: AssignmentsService,
          useValue: mockAssignmentsService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
    service = module.get<AssignmentsService>(AssignmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should assign a question to a user', async () => {
    const result = await controller.assign(1, 1);
    expect(result).toEqual({
      id: 1,
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      faq: { id: 1, question: 'Test Question', answer: null },
      answered: false,
    });
    expect(service.assignQuestion).toHaveBeenCalledWith(1, 1);
  });

  it('should mark an assignment as answered', async () => {
    const result = await controller.markAnswered(1);
    expect(result.answered).toBe(true);
    expect(service.markAsAnswered).toHaveBeenCalledWith(1);
  });

  it('should return all assignments', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(service.findAll).toHaveBeenCalled();
  });
});
